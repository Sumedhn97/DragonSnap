// background.js

// Initialize the screenshots array
let screenshots = [];

function clearScreenshots() {
  screenshots = [];
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "addScreenshot") {
    screenshots.push(request.screenshotUrl);
  } else if (request.action === "getScreenshots") {
    sendResponse({ screenshots });
  } else if (request.action === "clearScreenshots") {
    screenshots = [];  // Clear the screenshots array
    sendResponse({ status: "Screenshots cleared" });
  }
});
