/*global jQuery*/
/*global $*/

/**
 * This script defines essential functions for WordMark extraction and its further processing.
 */


//Find simple hash of text.
var hash = (value) => {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

//Extract WordMark
var extract = () => {

    //1. Get jQuery-friendly path to the selection's anchor-node's parent tag (here onwards referred as "Node").
    var pathToSelection = $(document.getSelection().anchorNode.parentNode).getPath();

    //2. Obtain top-offset of the Node.
    var offset = $(pathToSelection).offset() !== undefined ? $(pathToSelection).offset().top : 0;

    //3. Get the text in the Node for displaying on the launcher-page.
    var text = $(document.getSelection().anchorNode.parentNode).text();
    if(text === "" || text === undefined || text === null){
        text = "No extractable plain-text found in the selection."
    }

    //4. Time of creation
    var time = Date.now()

    //5. A simple hash of the extractable text to alert users later if the extractable text changes.
    var id = hash(pathToSelection + text);

    //6. Return evaluates information as an object.
    return {
        id : id,
        path: pathToSelection + "|" + offset,
        text: text,
        time: time
    }
}

//Set up getPath function that returns jQuery friendly path to a target node.
var setGetPath = () => {

    //Check if jQuery has been loaded before calling this script.
    if(typeof jQuery) {
        jQuery.fn.extend({
            getPath: function( path ) {

                //A. Check if path is defined.
                if ( typeof path == 'undefined' ) path = '';
                if ( this.is('html') )
                    return 'html' + path;
                if (this.length !== 1) throw 'Requires one element.';
                var path, node = this;

                //B. Set up jQuery friendly path-string
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
}

//Set up the getPath function if jQuery is loaded.
if(typeof jQuery !== undefined) {
    setGetPath();
} else {
    alert("Issue with the extension. Please reinstall");
}

