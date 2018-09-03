'use strict';

let content = document.getElementsByTagName("pre")[0].innerHTML;

document.getElementsByTagName("pre")[0].innerHTML = '';

let lines = content.split("\n");

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;

let newLineDeleted = '';
let newLineAdded = '';
let diffInfoLines = '';
let linesNumberAdded = '';
let linesNumberDeleted = '';

let fileInfoLines = '';

// [meta, oldCode, oldCodeLineNumber, newCodeLineNumber, newCode]
let diffsArrays = [];

class Diff {

    print() {
        console.log(this.meta);
        console.log(this.oldCode);
        console.log(this.newCode);
        console.log(this.oldCodeLineNumber);
        console.log(this.newCodeLineNumber);
    }
}
// Extract optional file's metadata.
// @TODO Handle display of fileInfoLines.
extractFileInfo();

lines.forEach(function (line) {

    if (line.startsWith('@@ ', 0)) {
        fillCode();

        let lineSplited = line.split(' ');

        diffInfoLines += line + '</br>';

        let diff = new Diff();
        diff.meta = diffInfoLines;
        diffsArrays.push(diff);
        diffInfoLines = '';

        initial = lineSplited[1].split(',');
        initialLength = initial[1];
        initial = initial[0].replace('-', '');

        edited = lineSplited[2].split(',');
        editedLength = edited[1];
        edited = edited[0].replace('+', '');

    }
    else if (line.startsWith('+++ ', 0) || line.startsWith('--- ', 0)) {
        diffInfoLines += line + '</br>';
    }
    else if (line.startsWith('+', 0)) {
        newLineAdded += '<span class="line"><span class="plus">' + line + '</span></span>\n';
        linesNumberAdded += '<span>' + initial + '</span>';
        initial++;
    }
    else if (line.startsWith('-', 0)) {
        newLineDeleted += '<span class="line"><span class="minus">' + line + '</span></span>\n';
        linesNumberDeleted += '<span>' + edited + '</span>';
        edited++;
    }
    else if (line.startsWith(' ', 0)) {
        linesNumberAdded += '<span>' + initial + '</span>';
        linesNumberDeleted += '<span>' + edited + '</span>';
        newLineAdded += '<span class="line"><span>' + line + '</span></span>\n';
        newLineDeleted += '<span class="line"><span>' + line + '</span></span>\n';
        initial++;
        edited++;
    }
    else if (line.startsWith('diff', 0)) {
        line = colorFileName(line);
        diffInfoLines += line;
    }
    else {
        diffInfoLines += line + '</br>';
    }

});

fillCode();
printCodeBlock();

function fillCode() {

    if (newLineAdded !== '' || newLineDeleted !== '') {

        let diff = diffsArrays[diffsArrays.length - 1];
        diff.oldCode = newLineDeleted;
        diff.oldCodeLineNumber = linesNumberDeleted;
        diff.newCodeLineNumber = linesNumberAdded;
        diff.newCode = newLineAdded;

        newLineDeleted = '';
        linesNumberDeleted = '';
        linesNumberAdded = '';
        newLineAdded = '';
    }
}

/**
 *
 * Check if there is metadata at the head of the file, add them to the fileInfoLines var
 * and remove them from lines array. They start with a blank space.
 * Ex :  .../media_wysiwyg/includes/media_wysiwyg.filter.inc |  4 ++++
 *       modules/media_wysiwyg/media_wysiwyg.module          | 21 +++++++++++++++++++++
 *       2 files changed, 25 insertions(+)
 * Ex: https://www.drupal.org/files/issues/2018-05-04/media-2967590-php-mbstring-extension-check-2.patch
 */
function extractFileInfo() {
    if (lines[0].startsWith(' ', 0)) {
        let i = 0;
        for (i; i < lines.length; i++) {
            if (lines[i].startsWith('diff ', 0)) {
                break;
            }
            else {
                fileInfoLines += lines[i] + '<br>';
            }
        }
        lines.splice(0, i);
    }
}

function colorFileName(line) {
    // Regex that match a/... and b/...
    let regexAB = new RegExp("\^\([ab])\/\?");

    let lineSplited = line.split(" ");
    lineSplited.forEach(function (word, index, currentArray) {
        // Highlight filename
        if (regexAB.test(word) === true) {
            let wordSplited = word.split('/');
            wordSplited[wordSplited.length - 1] = '<span class="filename">' + wordSplited[wordSplited.length - 1] + '</span>';
            currentArray[index] = '<b>' + wordSplited.join('/') + '</b>';
        }
        else {
            currentArray[index] = word;
        }
    });

    return lineSplited + '\n';
}


function printCodeBlock() {

    let pre = document.getElementsByTagName("pre")[0];

    // Print file's info if there is any
    if (fileInfoLines !== '') {
        let BlocFileInfo = document.createElement('bloc');
        BlocFileInfo.innerHTML = fileInfoLines;
        pre.appendChild(BlocFileInfo);
    }

    diffsArrays.forEach(function (diff) {

        let blocMeta = document.createElement('blocMeta');
        let bloc1 = document.createElement('bloc');
        let bloc2 = document.createElement('bloc');
        let linesBloc = document.createElement('line-bloc');

        let codeBloc = document.createElement('codeBloc');
        let linesAdd = document.createElement('add');
        let linesDel = document.createElement('delete');

        bloc1.className = 'left-bloc';
        bloc2.className = 'right-bloc';
        blocMeta.className = 'meta';

        blocMeta.innerHTML = diff.meta;
        bloc1.innerHTML = diff.oldCode;
        bloc2.innerHTML = diff.newCode;
        linesAdd.innerHTML = diff.newCodeLineNumber;
        linesDel.innerHTML = diff.oldCodeLineNumber;

        pre.appendChild(blocMeta);
        pre.appendChild(codeBloc);

        codeBloc.appendChild(bloc1);
        codeBloc.appendChild(linesBloc);
        linesBloc.appendChild(linesDel);
        linesBloc.appendChild(linesAdd);
        codeBloc.appendChild(bloc2);
    });


}

// Bind scroll event to every code bloc
let blocs = document.getElementsByTagName('bloc');
for (let i = 0; i < blocs.length; i++) {
    blocs[i].addEventListener('scroll', scrollEvent, false);
}

// Change position of the other code bloc on horizontal scroll
function scrollEvent(event) {
    if (event.type === 'scroll') {
        let scrollValue = event.target.scrollLeft;
        let targetClass = event.target.className;
        let otherDivClass = 'left-bloc';
        if (targetClass === 'left-bloc') {
            otherDivClass = 'right-bloc';
        }

        let otherDiv = event.target.parentElement.getElementsByClassName(otherDivClass);
        otherDiv[0].scrollLeft = scrollValue;
    }
}