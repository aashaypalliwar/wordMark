// Set up context menu at install time.
/*global chrome*/


let  processSelected = (info,tab) => {

    chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "wordMarkExtractor.js" }, function () {
            chrome.tabs.executeScript(null, { file: "wordMarkProcessor.js" });
        });
    });
}


chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: `${Math.floor((Math.random()*100000))}`,
        title: "WordMark",
        contexts:["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(processSelected);

chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if(request.message === "Fill Information"){
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                request.details.url = tabs[0].url;
                //alert(JSON.stringify(request.details));
                //alert("tabs:-");
                //alert(JSON.stringify(tabs));
                chrome.storage.sync.set({temporary: request.details }, function () {
                    //alert("saved temporary");
                    chrome.windows.create({
                        url : chrome.extension.getURL('wordmark.html'),
                        focused : true,
                        type : "popup",
                        height: 350,
                        width: 360
                    });
                });
            });
        }
        else if(request.message === "Open Browser State"){
            chrome.windows.create({
                url: request.tabs
            });
            //response({});
        }
        else if(request.message === "Open WordMark"){
            //alert("wordmark");
            //alert(JSON.stringify(request.wm));
            let { path, url, id } = request.wm;
            chrome.tabs.create({ url: url }, function (tab) {
                //alert("created url");
                // chrome.tabs.executeScript(tab.id, {file: "windowLoadScript.js"}, function () {
                    //alert("window load scr");
                    chrome.tabs.executeScript(tab.id, {file: "jquery-3.5.1.min.js"}, function () {
                        //alert("loadedjq");
                        chrome.tabs.executeScript(tab.id, {
                            code: "var wordMarkInfo = " + JSON.stringify(request.wm) + ";"
                        }, function () {
                            //alert("going to hi");
                            chrome.tabs.executeScript(tab.id, {file: 'highlightWordMark.js'});
                        });
                    });
                });
            // });
        }
    });








// chrome.windows.create({
//     url : chrome.extension.getURL('popup.html'),
//     focused : true,
//     type : "popup",
//     height: 330,
//     width: 350
// });
//
// , function (win) {
//     chrome.tabs.getAllInWindow(win.id, function(tabs){
//         //alert(JSON.stringify(tabs));
//         chrome.tabs.executeScript(tabs[0].id, { file: "wordMarkInjector.js" });
//     })
// }
