/*global extract*/
/*global chrome*/

//Extract details about the target wordMark
var details = extract();

//Call the message handler for pop-up creation and temporary storage.
chrome.runtime.sendMessage({message: "Fill Information", details: details});






