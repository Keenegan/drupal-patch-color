content = document.getElementsByTagName("pre")[0].innerHTML;

document.getElementsByTagName("pre")[0].innerHTML = '';

arrayOfLines = content.split("\n");

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;
let codeStart = 'false';
let newLineDeleted = '';
let newLineAdded = '';
let newLineMeta = '';

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
        initial++;
        newLineAdded += '<span class="line"><span class="line-number"><span class="new-line-number">' + initial + '</span></span><span class="plus">' + line + '</span></span>\n';
        newLineDeleted += '<span class="empty line"></span>';
    }
    else if (codeStart === 'true' && line.startsWith('-', 0)) {
        edited++;
        newLineAdded += '<span class="empty line"></span>';
        newLineDeleted += '<span class="line"><span class="line-number"><span class="old-line-number">' + edited + '</span></span><span class="minus">' + line + '</span></span>\n';
    }
    else if (codeStart === 'true' && line.startsWith(' ', 0)) {
        initial++;
        edited++;
        newLineAdded += '<span class="line"><span class="line-number"><span class="new-line-number">' + initial + '</span></span><span>' + line + '</span></span>\n';
        newLineDeleted += '<span class="line"><span class="line-number"><span class="old-line-number">' + edited + '</span></span><span>' + line + '</span></span>\n';
    }
    else if (line.startsWith('diff', 0)) {

        // Regex that match a/... and b/...
        regexAB = new RegExp("\^\([ab])\/\?");

        let lineSplited = line.split(" ");
        lineSplited.forEach(function (word, index, arrayTest) {
            // Highlight filename
            if (regexAB.test(word) === true) {
                wordSplited = word.split('/');
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
    let bloc2 = document.createElement('bloc');
    bloc1.innerHTML = newLineDeleted;
    bloc2.innerHTML = newLineAdded;
    document.getElementsByTagName("pre")[0].appendChild(bloc1);
    document.getElementsByTagName("pre")[0].appendChild(bloc2);
}
