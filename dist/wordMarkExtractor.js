/*global jQuery*/
/*global $*/

var hash = (value) => {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

var extract = () => {
    var pathToSelection = $(document.getSelection().anchorNode.parentNode).getPath();
    var offset = $(pathToSelection).offset() !== undefined ? $(pathToSelection).offset().top : 0;
    var text = $(document.getSelection().anchorNode.parentNode).text();
    if(text === "" || text === undefined || text === null){
        text = "No extractable plain-text found in the selection."
    }
    var time = Date.now()
    var id = hash(pathToSelection + text);
    return {
        id : id,
        path: pathToSelection + "|" + offset,
        text: text,
        time: time
    }
}

var setGetPath = () => {
    if(typeof jQuery) { //checking if jQuery has been loaded before calling this script
        jQuery.fn.extend({
            getPath: function( path ) {
                if ( typeof path == 'undefined' ) path = '';
                if ( this.is('html') )
                    return 'html' + path;
                if (this.length !== 1) throw 'Requires one element.';
                var path, node = this;
                while (node.length) {
                    var realNode = node[0], name = realNode.localName;
                    if (!name) break;
                    name = name.toLowerCase();

                    var parent = node.parent();

                    var siblings = parent.children(name);
                    if (siblings.length > 1) {
                        name += ':eq(' + siblings.index(realNode) + ')';
                    }


                    path = name + (path ? '>' + path : '');
                    node = parent;
                }
                return path;
            }
        });
    }
    else {
        alert("Please load jQuery before calling the selector script for it to function.");
    }
    //extract();
}

if(typeof jQuery !== undefined) {
    //alert("called")
    setGetPath();
} else {
    alert("Issue with the extension. Please reinstall");
}

