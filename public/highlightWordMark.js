/*global wordMarkInfo*/
/*global $*/
/*global windowHasLoaded*/


//Set up hash function on the webpage
var hash = (value) => {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

//Highlight the WordMark
var highlight = function() {

    //Get offset and path from loaded wordMark information.
    var elementInformation = wordMarkInfo.path.split("|");
    var oldOffset = elementInformation[1];
    wordMarkInfo.path = elementInformation[0];

    //Reset offset to place the wordMark away from sticky navbars. 
    var offset = oldOffset - 300

    //If offset was not stored earlier, use the offset of the Node indicated by current path. 
    if($(wordMarkInfo.path).offset() !== undefined){
        offset = $(wordMarkInfo.path).offset().top - 300;
    }

    //If offset is not properly found, set it to zero.
    if(offset < 0){
        offset = 0;
    }

    //1. Scroll down to the WordMark node.
    $('html, body').animate({ scrollTop: offset }, 'slow', function () {

        //2. Get the extractable text from the Node.
        var currentText = $(wordMarkInfo.path).text();
        if(currentText === "" || currentText === undefined || currentText === null){
            currentText = "No extractable plain-text found in the selection."
        }

        //3. If the hash of extractable text and path doesn't match stored hash, display alert.
        if(hash(wordMarkInfo.path + currentText) !== wordMarkInfo.id){
            alert("The text you wordMarked might have been changed.");
        }

        //4. Highlight the WordMark node.
        $(wordMarkInfo.path).css("backgroundColor", "#d4ff32");
    });
};

//Set the onLoad listener to fire highlight function when the target webpage loads to display WordMark
window.onload = highlight;

//If the window loads before the script is run, the onload handler will not be fired.
//Check if the navigation is set up before this script loads (indicating the load event has finished before the script is ran)
var navData = window.performance.getEntriesByType("navigation");
if (navData.length > 0 && navData[0].loadEventEnd > 0)
{
    highlight();
} else {
    console.log('Document is not loaded, WordMark will be highlighted once the website loads.');
}