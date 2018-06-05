content = document.getElementsByTagName("pre")[0].innerHTML;

arrayOfLines = content.split("\n");

document.getElementsByTagName("pre")[0].innerHTML = "";

arrayOfLines.forEach(function (line) {
    if (line.startsWith('+', 0)) {
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="plus">' + line + '</span>\n';
    }
    else if (line.startsWith('-', 0)) {
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="minus">' + line + '</span>\n';
    }
    else if (line.startsWith('diff', 0)) {

        // Regex that match a/... and b/...
        regexAB = new RegExp("\^\([ab])\/\?");

        lineSplited = line.split(" ");
        lineSplited.forEach(function (word, index, arrayTest) {
            resultat = regexAB.test(word);
            // Highlight filename
            if (resultat === true) {
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
