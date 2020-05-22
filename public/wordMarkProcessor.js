/*global extract*/
/*global chrome*/

var details = extract();
console.log(details);

chrome.storage.sync.set({temporary: {
        [details.id]: details
    }}, function () {
    alert("saved temporary");
    chrome.runtime.sendMessage({message: "Fill Information", details: details}, function(response) {
        console.log(response);
    });
});


