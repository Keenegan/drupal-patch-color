content = document.getElementsByTagName("pre")[0].innerHTML;

arrayOfLines = content.split("\n");

document.getElementsByTagName("pre")[0].innerHTML = "";

arrayOfLines.forEach(function (element) {
    if (element.startsWith('+', 0)) {
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="plus">' + element + '</span>\n';
    } else if (element.startsWith('-', 0)) {
        document.getElementsByTagName('pre')[0].innerHTML += '<span class="minus">' + element + '</span>\n';
    } else {
        document.getElementsByTagName('pre')[0].innerHTML += element + '\n';
    }
});
