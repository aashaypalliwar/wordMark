/*global wordMarkInfo*/
/*global $*/
/*global windowHasLoaded*/

var hash = (value) => {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

var highlight = function() {
    //alert("hilitscript")
    var elementInformation = wordMarkInfo.path.split("|");
    var oldOffset = elementInformation[1];
    wordMarkInfo.path = elementInformation[0];
    console.log(elementInformation);
    console.log(oldOffset);
    console.log(wordMarkInfo);
    var offset = oldOffset - 300
    if($(wordMarkInfo.path).offset() !== undefined){
        offset = $(wordMarkInfo.path).offset().top - 300;
    }
    if(offset < 0){
        offset = 0;
    }
    console.log(offset)

    $('html, body').animate({ scrollTop: offset }, 'slow', function () {
        var currentText = $(wordMarkInfo.path).text();
        if(currentText === "" || currentText === undefined || currentText === null){
            currentText = "No extractable plain-text found in the selection."
        }
        if(hash(wordMarkInfo.path + currentText) !== wordMarkInfo.id){
            alert("The text you wordMarked might have been changed.");
        }
        $(wordMarkInfo.path).css("backgroundColor", "#d4ff32");
    });
};

window.onload = highlight;

var navData = window.performance.getEntriesByType("navigation");
if (navData.length > 0 && navData[0].loadEventEnd > 0)
{
    highlight();
} else {
    console.log('Document is not loaded');
}


