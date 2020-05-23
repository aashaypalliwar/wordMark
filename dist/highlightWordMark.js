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

$(document).ready(function () {

    $('html, body').animate({ scrollTop: $(wordMarkInfo.path).offset().top - 300 }, 'slow', function () {
        var currentText = $(wordMarkInfo.path).contents().filter(function() {
            return this.nodeType === Node.TEXT_NODE;
        }).text();
        if(hash(currentText+wordMarkInfo.path) !== wordMarkInfo.id){
            alert("The webpage you wordmarked might have been changed.");
        }
        // $(wordMarkInfo.path).effect("highlight", {}, 3000);
        $(wordMarkInfo.path).css("background-color", "#d4ff32");
    });
});




