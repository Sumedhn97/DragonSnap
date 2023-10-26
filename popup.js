// popup.js

// Reference to jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Initialize the array to hold screenshots
let screenshots = [];

// Function to open the cropping page with the screenshot
function addScreenshot(screenshotUrl) {
  chrome.tabs.create({ url: `crop.html?imgUrl=${encodeURIComponent(screenshotUrl)}` });
}

// Function to retrieve screenshots from the background script
function getScreenshots(callback) {
  chrome.runtime.sendMessage({ action: "getScreenshots" }, function(response) {
    callback(response.screenshots);
  });
}

// Function to clear screenshots from the background script
function clearScreenshots(callback) {
  chrome.runtime.sendMessage({ action: "clearScreenshots" }, function(response) {
    callback(response.status);
  });
}

// Event listener for capturing and adding a screenshot
document.getElementById("screenshot-button").addEventListener("click", function() {
  var button = document.getElementById("screenshot-button");
  button.disabled = true;  // Disable button to prevent further clicks

  setTimeout(function() {
    chrome.tabs.captureVisibleTab(null, {}, function(screenshotUrl) {
      addScreenshot(screenshotUrl);  // Open the cropping page with the screenshot

      button.disabled = false;  // Re-enable button after timeout
    });
  }, 1000);  // 1000 milliseconds delay
});

// Event listener for generating PDF using stored screenshots
document.getElementById("generate-pdf-button").addEventListener("click", function() {
  generatePDF();
});

function generatePDF() {
  getScreenshots(function(screenshots) {
    if (screenshots.length === 0) {
      console.log('No screenshots to generate PDF.');
      return;
    }

    const pdf = new jsPDF();
    let imgCount = 0;

    function addImageToPdf(imgUrl) {
      loadImage(imgUrl, function(img) {
        pdf.addImage(imgUrl, 'PNG', 10, 10, 190, (190 * img.height) / img.width);
        imgCount++;

        if (imgCount === screenshots.length) {
          finalizePDF(pdf);
        } else {
          pdf.addPage();
          addImageToPdf(screenshots[imgCount]);  // Add the next image
        }
      });
    }

    addImageToPdf(screenshots[0]);  // Start adding images to PDF
  });
}

function loadImage(imgUrl, callback) {
  const img = new Image();
  img.src = imgUrl;
  img.onload = function() {
    callback(img);
  };
}

function finalizePDF(pdf) {
  const filename = `screenshots_${new Date().toISOString().replace(/[^0-9]/g, '')}.pdf`;
  pdf.save(filename);

  clearScreenshots(function(status) {
    console.log(status);  // Logs "Screenshots cleared"
    updateScreenshotCount();
  });
}

// Function to update the screenshot count display
function updateScreenshotCount() {
  getScreenshots(function(screenshots) {
      const count = screenshots.length;
      document.getElementById('screenshot-count').textContent = `Stored Screenshots: ${count}`;
  });
}

// Update the screenshot count display when the popup is loaded
document.addEventListener('DOMContentLoaded', updateScreenshotCount);