/*global jQuery*/
/*global $*/
/*global chrome*/

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'Extractor loaded?') {
        sendResponse({status: "yes"});
    }
});


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
    alert("extract called")
    console.log(document.getSelection());
    let path = $(document.getSelection().anchorNode.parentNode).getPath();
    let text = $(document.getSelection().anchorNode.parentNode).contents().filter(function() {
        return this.nodeType == Node.TEXT_NODE;
    }).text();

    let id = hash(text+path);
    return {
        id : id,
        path: path,
        text: text
    }
}

var setGetPath = () => {
    if(typeof jQuery) { //checking if jQuery has been loaded before calling this script
        console.log("Selector script started !");
        jQuery.fn.extend({
            getPath: function( path ) {
                if ( typeof path == 'undefined' ) path = '';
                if ( this.is('html') )
                    return 'html' + path;
                if (this.length != 1) throw 'Requires one element.';
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
    alert("called")
    setGetPath();
} else {
    alert("issue");
}















//
// let extract = () => {
//     // alert((typeof document.getSelection()).toString());
//     // alert(document.getSelection());
//     $("*").select(function () {
//         let path = $(this).getPath();
//         alert(path);
//     })
// }
//
// let setGetPath = () => {
//     if(typeof jQuery) { //checking if jQuery has been loaded before calling this script
//         console.log("Selector script started !");
//         jQuery.fn.extend({
//             getPath: function( path ) {
//                 if ( typeof path == 'undefined' ) path = '';
//                 if ( this.is('html') )
//                     return 'html' + path;
//                 if (this.length != 1) throw 'Requires one element.';
//                 var path, node = this;
//                 while (node.length) {
//                     var realNode = node[0], name = realNode.localName;
//                     if (!name) break;
//                     name = name.toLowerCase();
//
//                     var parent = node.parent();
//
//                     var siblings = parent.children(name);
//                     if (siblings.length > 1) {
//                         name += ':eq(' + siblings.index(realNode) + ')';
//                     }
//
//                     path = name + (path ? '>' + path : '');
//                     node = parent;
//                 }
//                 return path;
//             }
//         });
//     }
//     else {
//         alert("Please load jQuery before calling the selector script for it to function.");
//     }
//     extract();
// }
//
// if(typeof jQuery=='undefined') {
//     alert("called")
//     console.log("1");
//     let headTag = document.getElementsByTagName("head")[0];
//     let jqTag = document.createElement('script');
//     jqTag.type = 'text/javascript';
//     jqTag.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
//     console.log("2");
//     jqTag.onload = setGetPath;
//     headTag.appendChild(jqTag);
// } else {
//     alert("hey");
//     setGetPath();
// }
//
//

