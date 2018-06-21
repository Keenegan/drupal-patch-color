content = document.getElementsByTagName("pre")[0].innerHTML;

arrayOfLines = content.split("\n");

document.getElementsByTagName("pre")[0].innerHTML = "";

let initial = 0;
let initialLength = 0;
let edited = 0;
let editedLength = 0;
let maxLineNumbers = 0;
let spaces = '';
let codeStart = 'false';

//@TODO fix variables names
//@TODO clean code
arrayOfLines.forEach(function (line) {

  if (line.startsWith('@@ ', 0)) {
    let lineSplited = line.split(" ");
    if (lineSplited[3] === '@@') {
      spaces = '';
      codeStart = 'true';
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
      maxLineNumbers = maxLineNumbers.toString().length;
      for (i = 0; i < maxLineNumbers; i++) {
        spaces += ' ';
      }
    }
  }

  if (codeStart == 'true' && line.startsWith('+++ b', 0) || line.startsWith('--- a', 0)) {
    newLine = line + '\n';
  }
  else if (codeStart == 'true' && line.startsWith('+', 0)) {
    initial++;
    newLine = '<span class="line"><span class="line-number"><span class="new-line-number">' + initial + '</span><span class="old-line-number">' + spaces + '</span></span><span class="plus">' + line + '</span></span>\n';
  }
  else if (codeStart == 'true' && line.startsWith('-', 0)) {
    edited++;
    newLine = '<span class="line"><span class="line-number"><span class="new-line-number">' + spaces + '</span><span class="old-line-number">' + edited + '</span></span><span class="minus">' + line + '</span></span>\n';
  }
  else if (codeStart == 'true' && line.startsWith(' ', 0)) {
    initial++;
    edited++;
    newLine = '<span class="line"><span class="line-number"><span class="new-line-number">' + initial + '</span><span class="old-line-number">' + edited + '</span></span><span>' + line + '</span></span>\n';
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

    newLine = lineSplited.join(' ') + '\n';
  }
  else {
    newLine = line + '\n';
  }

  // Render the newLine
  document.getElementsByTagName('pre')[0].innerHTML += newLine;
});
