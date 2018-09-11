'use strict';

const fs = require('fs');
const archiver = require('archiver');

// Get the version number from the manifest.json file
const manifestJson = require('../manifest.json');

// Create a file to stream archive data to.
const fileName = 'drupal-patch-color-' + manifestJson.version + '.zip';
const fileDir = __dirname + '/../' + fileName;
const output = fs.createWriteStream(fileDir);

// Sets the compression level.
const archive = archiver('zip', {
    zlib: {level: 9}
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function () {
    console.log('The file ' + fileName + ' has been created. ' + archive.pointer() + ' total bytes');
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function () {
    console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        // log warning
        console.log('warning ' + err.code);
    } else {
        // throw error
        throw err;
    }
});

// good practice to catch this error explicitly
archive.on('error', function (err) {
    throw err;
});

// pipe archive data to the file
archive.pipe(output);

let files = ['manifest.json', 'README.md'];

for (let i = 0; i < files.length; i++) {
    let path = __dirname + '/../' + files[i];
    archive.file(path, {name: files[i]});
}

// append files from a sub-directory and naming it `new-subdir` within the archive
archive.directory('styles', 'styles');
archive.directory('icons', 'icons');
archive.directory('scripts', 'scripts');

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();