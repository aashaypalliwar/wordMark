// Set up context menu at install time.
/*global chrome*/


let  processSelected = (info,tab) => {

    chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "wordMarkExtractor.js" }, function () {
            chrome.tabs.executeScript(null, { file: "wordMarkProcessor.js" });
        });
    });
}

chrome.contextMenus.create({
    id: `${Math.floor((Math.random()*100000))}`,
    title: "WordMark",
    contexts:["selection"]
});

chrome.contextMenus.onClicked.addListener(processSelected);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.windows.create({
            url : chrome.extension.getURL('wordmark.html'),
            focused : true,
            type : "popup",
            height: 350,
            width: 360
        });
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
//         alert(JSON.stringify(tabs));
//         chrome.tabs.executeScript(tabs[0].id, { file: "wordMarkInjector.js" });
//     })
// }
