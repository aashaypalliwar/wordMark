/*global extract*/
/*global chrome*/

var details = extract();
console.log(details);

chrome.storage.sync.set({temporary: details
    }, function () {
    alert("saved temporary");
    chrome.runtime.sendMessage({message: "Fill Information", details: details});
});


