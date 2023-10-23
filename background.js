// background.js

// Initialize the screenshots array
let screenshots = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "addScreenshot") {
    screenshots.push(request.screenshotUrl);
  } else if (request.action === "getScreenshots") {
    sendResponse({ screenshots });
  }
});
