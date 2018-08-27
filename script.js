'use strict';

let content = document.getElementsByTagName("pre")[0].innerHTML;

document.getElementsByTagName("pre")[0].innerHTML = '';

let arrayOfLines = content.split("\n");

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;
let codeStart = 'false';
let newLineDeleted = '';
let newLineAdded = '';
let newLineMeta = '';
let linesNumberAdded = '';
let linesNumberDeleted = '';

arrayOfLines.forEach(function (line) {

    if (line.startsWith('@@ ', 0)) {
        let lineSplited = line.split(" ");
        if (lineSplited[3] === '@@') {
            codeStart = 'true';
            initial = lineSplited[1].split(',');
            initialLength = initial[1];
            initial = initial[0].replace('-', '');

            edited = lineSplited[2].split(',');
            editedLength = edited[1];
            edited = edited[0].replace('+', '');

            newLineMeta += line + '</br>';

            if (newLineDeleted !== '') {
                printCodeBlock();
                newLineDeleted = '';
                newLineAdded = '';
                linesNumberAdded = '';
                linesNumberDeleted = '';
            }

            let textnode = document.createElement('blocMeta');
            textnode.innerHTML = newLineMeta;
            document.getElementsByTagName("pre")[0].appendChild(textnode);
            newLineMeta = '';
        }
    }

    if (codeStart === 'true' && line.startsWith('+++ ', 0) || line.startsWith('--- ', 0)) {
        newLineMeta += line + '</br>';
    }
    else if (codeStart === 'true' && line.startsWith('+', 0)) {
        newLineAdded += '<span class="line"><span class="plus">' + line + '</span></span>\n';
        linesNumberAdded += '<span>' + initial + '</span>';
        initial++;
    }
    else if (codeStart === 'true' && line.startsWith('-', 0)) {
        newLineDeleted += '<span class="line"><span class="minus">' + line + '</span></span>\n';
        linesNumberDeleted += '<span>' + edited + '</span>';
        edited++;
    }
    else if (codeStart === 'true' && line.startsWith(' ', 0)) {
        linesNumberAdded += '<span>' + initial + '</span>';
        linesNumberDeleted += '<span>' + edited + '</span>';
        newLineAdded += '<span class="line"><span>' + line + '</span></span>\n';
        newLineDeleted += '<span class="line"><span>' + line + '</span></span>\n';
        initial++;
        edited++;
    }
    else if (line.startsWith('diff', 0)) {

        // Regex that match a/... and b/...
        let regexAB = new RegExp("\^\([ab])\/\?");

        let lineSplited = line.split(" ");
        lineSplited.forEach(function (word, index, arrayTest) {
            // Highlight filename
            if (regexAB.test(word) === true) {
                let wordSplited = word.split('/');
                wordSplited[wordSplited.length - 1] = '<span class="filename">' + wordSplited[wordSplited.length - 1] + '</span></br>';
                arrayTest[index] = '<b>' + wordSplited.join('/') + '</b>';
            }
            else {
                arrayTest[index] = word;
            }
        });

        newLineMeta += lineSplited.join(' ') + '\n';
    }
    else {
        newLineMeta += line + '\n';
    }

});
printCodeBlock();


function printCodeBlock() {
    let bloc1 = document.createElement('bloc');
    let linesBloc = document.createElement('line-bloc');
    let bloc2 = document.createElement('bloc');
    let codeBloc = document.createElement('codeBloc');
    let linesAdd = document.createElement('add');
    let linesDel = document.createElement('delete');

    bloc1.className = 'left-bloc';
    bloc2.className = 'right-bloc';
    bloc1.innerHTML = newLineDeleted;
    bloc2.innerHTML = newLineAdded;
    linesAdd.innerHTML = linesNumberAdded;
    linesDel.innerHTML = linesNumberDeleted;

    let pre = document.getElementsByTagName("pre")[0];
    pre.appendChild(codeBloc);
    codeBloc.appendChild(bloc1);
    codeBloc.appendChild(linesBloc);
    linesBloc.appendChild(linesDel);
    linesBloc.appendChild(linesAdd);
    codeBloc.appendChild(bloc2);
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