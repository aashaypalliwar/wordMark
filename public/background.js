/*global chrome*/

// Set up context menu at install time.
chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: `${Math.floor((Math.random()*100000))}`,
        title: "WordMark",
        contexts:["selection"]
    });
});

/**
 * OnClick Listener (Context Menu)
 * Execute wordMark extraction and processing scripts on selection.
 */
let  processSelected = (info,tab) => {
    chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "wordMarkExtractor.js" }, function () {
            chrome.tabs.executeScript(null, { file: "wordMarkProcessor.js" });
        });
    });
}

//Add listener to onClick event on context-menu
chrome.contextMenus.onClicked.addListener(processSelected);

//Message handler
chrome.runtime.onMessage.addListener(
    function(request, sender, response) {

        //Wordmark popup creation and temporary storage of website-data.
        if(request.message === "Fill Information"){
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                request.details.url = tabs[0].url;
                chrome.storage.sync.set({temporary: request.details }, function () {
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
        //Launch new window with given tabs.
        else if(request.message === "Open Browser State"){
            chrome.windows.create({
                url: request.tabs
            });
        }
        //Open WordMark
        else if(request.message === "Open WordMark"){
            let { path, url, id } = request.wm;

            //1. Open WordMark's URL in new browser tab.
            chrome.tabs.create({ url: url }, function (tab) {

                //2. Load jQuery in the webpage opened.
                chrome.tabs.executeScript(tab.id, {file: "jquery-3.5.1.min.js"}, function () {
                    
                    //3. Load wordMark information in the webpage opened.
                    chrome.tabs.executeScript(tab.id, {
                        code: "var wordMarkInfo = " + JSON.stringify(request.wm) + ";"
                    }, function () {
                        
                        //4. Highlight the wordMark
                        chrome.tabs.executeScript(tab.id, {file: 'highlightWordMark.js'});
                    });
                });
            });
        }
    });