// background.js

// Function to clear the screenshots array
function clearScreenshots() {
  chrome.storage.local.set({ screenshots: [] }, function() {
    console.log('Screenshots array cleared');
  });
}

// Add a message listener to handle messages sent from other parts of the extension (e.g., popup script)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  // Check the action property of the message to determine what action to take
  if (request.action === "addModScreenshot") {
    
    // If the action is "addScreenshot", get the current screenshots array, add the new screenshot URL, and then save it back to chrome.storage.local
    chrome.storage.local.get(['screenshots'], function(result) {
      const screenshots = result.screenshots || [];
      screenshots.push(request.screenshotUrl);
      chrome.storage.local.set({ screenshots }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error saving screenshots:', chrome.runtime.lastError);
          sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
        } else {
          console.log('Screenshot added');
          sendResponse({ status: 'success' });
        }
      });
    });
    
  } else if (request.action === "getScreenshots") {
    
    // If the action is "getScreenshots", retrieve the screenshots array from chrome.storage.local and send it back as the response
    chrome.storage.local.get(['screenshots'], function(result) {
      sendResponse({ screenshots: result.screenshots || [] });
    });
    
  } else if (request.action === "clearScreenshots") {
    
    // If the action is "clearScreenshots", clear the screenshots array
    clearScreenshots();
    
    // Send a response back indicating that the screenshots have been cleared
    sendResponse({ status: "Screenshots cleared" });
  }

  // Indicates that sendResponse will be called asynchronously
  return true;
});
