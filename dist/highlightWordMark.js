/*global wordMarkInfo*/
/*global $*/

var hash = (value) => {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

// $(document).ready(function () {
window.onload = function() {

    // alert(JSON.stringify(wordMarkInfo));
    // alert(JSON.stringify($(wordMarkInfo.path).offset()));
    // alert(JSON.stringify($(wordMarkInfo.path).getBoundingClientRect()));
    // alert(JSON.stringify($(wordMarkInfo.path)));


    var offset = $(wordMarkInfo.path).offset().top - 300;
    if(offset < 0){
        offset = 0;
    }
    $('html, body').animate({ scrollTop: offset }, 'slow', function () {
        var currentText = $(wordMarkInfo.path).text();
        if(hash(currentText+wordMarkInfo.path) !== wordMarkInfo.id){
            alert("The text you wordMarked might have been changed.");
        }

        var outerContainer = wordMarkInfo.path.substring(0, wordMarkInfo.path.lastIndexOf('>'));
        console.log(outerContainer);
        // $(wordMarkInfo.path).closest("div").css("backgroundColor", "#e6ff87");
        $(outerContainer).css("backgroundColor", "#e6ff87");
        $(wordMarkInfo.path).css("backgroundColor", "#d4ff32");
    });
};




