'use strict';

let content = document.getElementsByTagName("pre")[0].innerHTML;

document.getElementsByTagName("pre")[0].innerHTML = '';

let lines = content.split("\n");

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;
let codeStarted = false;

let newLineDeleted = '';
let newLineAdded = '';
let diffInfoLines = '';
let linesNumberAdded = '';
let linesNumberDeleted = '';

let numberOfChangedFiles = 0;
let numberOfAdditions = 0;
let numberOfDeletions = 0;

/**
 * Contains general informations about the patch file
 * Ex : how many lines are added, deleted, ect..
 * @type {string}
 */
let fileInfoLines = '';

/**
 * An array of Diff objects
 * @type {Array}
 */
let diffsArrays = [];

class Diff {
    // Print the variables in the console
    debug() {
        console.log(this.meta);
        console.log(this.oldCode);
        console.log(this.newCode);
        console.log(this.oldCodeLineNumber);
        console.log(this.newCodeLineNumber);
    }

    // Print the diff into an HTMLElement
    print(HtmlElement) {

        let blocMeta = document.createElement('blocMeta');
        let bloc2 = document.createElement('bloc');
        let linesBloc = document.createElement('line-bloc');

        let codeBloc = document.createElement('codeBloc');
        let linesAdd = document.createElement('add');
        let linesDel = document.createElement('delete');

        // If this is a new file, don't print the "old code" bloc
        if (this.oldCode !== '' && this.oldCode !== undefined) {
            let bloc1 = document.createElement('bloc');
            bloc1.className = 'left-bloc';
            bloc1.innerHTML = this.oldCode;
            // Bind scroll event on both code blocs
            bloc1.addEventListener('scroll', scrollEvent, false);
            bloc2.addEventListener('scroll', scrollEvent, false);
        }

        bloc2.className = 'right-bloc';
        blocMeta.className = 'meta';

        blocMeta.innerHTML = '<p>' + this.meta + '</p>';

        bloc2.innerHTML = this.newCode !== undefined ? this.newCode : '';
        linesAdd.innerHTML = this.newCodeLineNumber !== undefined ? this.newCodeLineNumber : '';
        linesDel.innerHTML = this.oldCodeLineNumber !== undefined ? this.oldCodeLineNumber : '';

        codeBloc.appendChild(linesBloc);
        linesBloc.appendChild(linesDel);
        linesBloc.appendChild(linesAdd);
        codeBloc.appendChild(bloc2);

        HtmlElement.appendChild(blocMeta);
        HtmlElement.appendChild(codeBloc);
    }

    //@TODO Add function print side by side and print inline
}

// Extract optional file's metadata.
extractFileInfo();

lines.forEach(function (line) {

    if (line.startsWith('@@ ', 0)) {
        updateLastDiff();

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

    } else if (line.startsWith('diff', 0)) {
        codeStarted = true;
        line = colorFileName(line);
        diffInfoLines += line;
        numberOfChangedFiles++;
    } else if (codeStarted === false) {
        diffInfoLines += line + '</br>';
    } else if (line === '-- ') {
        diffInfoLines += line + '</br>';
    } else if (line.startsWith('+++ ', 0) || line.startsWith('--- ', 0)) {
        diffInfoLines += line + '</br>';
    } else if (line.startsWith('+', 0)) {
        newLineAdded += '<span class="line"><span class="plus">' + line + '</span></span>\n';
        linesNumberAdded += '<span>' + initial + '</span>';
        initial++;
        numberOfAdditions++;
    } else if (line.startsWith('-', 0)) {
        newLineDeleted += '<span class="line"><span class="minus">' + line + '</span></span>\n';
        linesNumberDeleted += '<span>' + edited + '</span>';
        edited++;
        numberOfDeletions++;
    } else if (line.startsWith(' ', 0)) {
        linesNumberAdded += '<span>' + initial + '</span>';
        linesNumberDeleted += '<span>' + edited + '</span>';
        newLineAdded += '<span class="line"><span>' + line + '</span></span>\n';
        newLineDeleted += '<span class="line"><span>' + line + '</span></span>\n';
        initial++;
        edited++;
    } else {
        diffInfoLines += line + '</br>';
    }
});

// Update the last diff of the diffArray
updateLastDiff();

// Print the whole diffArray
printCodeBlock();

/**
 * Add code to the last diff object of the diffArray.
 */
function updateLastDiff() {
    // Check if there is new code to add on the diff object.
    if (newLineAdded !== '' || newLineDeleted !== '') {

        // Get the last diff of the array
        let diff = diffsArrays[diffsArrays.length - 1];
        diff.oldCode = newLineDeleted;
        diff.oldCodeLineNumber = linesNumberDeleted;
        diff.newCodeLineNumber = linesNumberAdded;
        diff.newCode = newLineAdded;

        // Reset the temporary code variables .
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
        // Parse the lines array, stop when the metadata start (when the line starts with a 'diff')
        for (i; i < lines.length; i++) {
            if (lines[i].startsWith('diff ', 0)) {
                break;
            } else {
                fileInfoLines += lines[i] + '<br>';
            }
        }
        // Remove the file info from the lines array
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
            currentArray[index] = wordSplited.join('/');
        } else {
            currentArray[index] = word;
        }
    });

    return lineSplited.join(' ') + '\n';
}

/**
 * Print the whole diffArray and metadatas.
 */
function printCodeBlock() {

    let pre = document.getElementsByTagName("pre")[0];

    // Print file's info if there is any
    if (fileInfoLines !== '') {
        let BlocFileInfo = document.createElement('bloc');
        BlocFileInfo.innerHTML = fileInfoLines;
        pre.appendChild(BlocFileInfo);
    }

    // Print the metadata and the code of the diff
    diffsArrays.forEach(function (diff) {
        diff.print(pre);
    });


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

// Print introduction block
printIntroBlock();

/**
 * Print introduction block containing info about number of changed files, additions, and deletions
 */
function printIntroBlock() {
    if (fileInfoLines !== '' || (numberOfChangedFiles === 0 && numberOfAdditions === 0 && numberOfDeletions === 0)) {
        return
    }

    let blockIntro = document.createElement('blockIntro');

    // Set text for changed files
    let changedFilesText = numberOfChangedFiles + ' ' + (numberOfChangedFiles > 1 ? 'files' : 'file') + '  changed';

    // Set text for additions
    let additionsText = numberOfAdditions + ' ' + (numberOfAdditions > 1 ? 'insertions' : 'insertion') + '(+)';

    // Set text for deletions
    let deletionsText = numberOfDeletions + ' ' + (numberOfAdditions > 1 ? 'deletions' : 'deletion') + '(-)';

    // Print the block
    blockIntro.innerHTML = "<p><span class='changed-files'>" + changedFilesText + "</span>, " +
        "<span class='additions'>" + additionsText + "</span> <span class='deletions'>" + deletionsText + "</span></p>";
    document.body.insertBefore(blockIntro, document.body.firstChild);
}
