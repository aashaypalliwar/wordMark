/*global extract*/
/*global chrome*/

var details = extract();
console.log(details);

chrome.runtime.sendMessage({message: "Fill Information", details: details});






