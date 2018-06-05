content = document.getElementsByTagName("pre")[0].innerHTML;

arrayOfLines = content.split("\n");

document.getElementsByTagName("pre")[0].innerHTML = "";

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;
let maxLineNumbers = 0;

arrayOfLines.forEach(function (line) {

    if (line.startsWith('@@ ', 0)) {
        let lineSplited = line.split(" ");
        if (lineSplited[3] === '@@') {
            initial = lineSplited[1].split(',');
            initialLength = initial[1];
            initial = initial[0].replace('-', '');

            edited = lineSplited[2].split(',');
            editedLength = edited[1];
            edited = edited[0].replace('+', '');

            if (parseInt(initial) + parseInt(initialLength) > parseInt(edited) + parseInt(editedLength)) {
                maxLineNumbers = parseInt(initial) + parseInt(initialLength);
            } else {
                maxLineNumbers = parseInt(edited) + parseInt(editedLength);
            }
        }
    }

    if (line.startsWith('+', 0)) {

        document.getElementsByTagName('pre')[0].innerHTML += (initial++) + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += ('  ') + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="plus">' + line + '</span>\n';

    }
    else if (line.startsWith('- ', 0)) {
        document.getElementsByTagName('pre')[0].innerHTML += ('  ') + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += (edited++) + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="minus">' + line + '</span>\n';
    }
    else if (line.startsWith(' ', 0)) {

        document.getElementsByTagName('pre')[0].innerHTML += (initial++) + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += (edited++) + ' | ';
        document.getElementsByTagName('pre')[0].innerHTML += line + '\n';

    }
    else if (line.startsWith('diff', 0)) {

        // Regex that match a/... and b/...
        regexAB = new RegExp("\^\([ab])\/\?");

        let lineSplited = line.split(" ");
        lineSplited.forEach(function (word, index, arrayTest) {
            // Highlight filename
            if (regexAB.test(word) === true) {
                wordSplited = word.split('/');
                wordSplited[wordSplited.length - 1] = '<span class="filename">' + wordSplited[wordSplited.length - 1] + '</span>';
                arrayTest[index] = '<b>' + wordSplited.join('/') + '</b>';
            }
            else {
                arrayTest[index] = word;
            }
        });

        document.getElementsByTagName('pre')[0].innerHTML += lineSplited.join(' ') + '\n';
    }
    else {
        document.getElementsByTagName('pre')[0].innerHTML += line + '\n';
    }
});
