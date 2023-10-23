window.jsPDF = window.jspdf.jsPDF;
let screenshots = []; // Initialize the array

// Function to add a screenshot to the background script
function addScreenshot(screenshotUrl) {
  chrome.runtime.sendMessage({ action: "addScreenshot", screenshotUrl });
}

// Function to get the screenshots from the background script
function getScreenshots(callback) {
  chrome.runtime.sendMessage({ action: "getScreenshots" }, function(response) {
    callback(response.screenshots);
  });
}

// Capture and add a screenshot
document.getElementById("screenshot-button").addEventListener("click", function() {
  chrome.tabs.captureVisibleTab(null, {}, function(screenshotUrl) {
    // Send the screenshot to the background script for storage
    addScreenshot(screenshotUrl);

    // The rest of your code here, including displaying the small preview on the canvas
    var canvas = document.getElementById("screenshot-canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();

    img.src = screenshotUrl;
    img.onload = function() {
      // Define the dimensions for the small preview
      var previewWidth = 200; // Adjust as needed
      var previewHeight = (previewWidth * img.height) / img.width;

      // Set canvas dimensions for the small preview
      canvas.width = previewWidth;
      canvas.height = previewHeight;

      // Draw the small preview on the canvas
      ctx.drawImage(img, 0, 0, previewWidth, previewHeight);
    };
  });
});

// Generate PDF using stored screenshots
document.getElementById("generate-pdf-button").addEventListener("click", function() {
  // Use the getScreenshots function to retrieve the screenshots array
  getScreenshots(function(screenshots) {
    const pdf = new jsPDF();
    let imgCount = 0;

    function addImageToPdf(imgUrl) {
      const img = new Image();
      img.src = imgUrl;
      img.onload = function() {
        // Add the image to the PDF
        pdf.addImage(imgUrl, 'PNG', 10, 10, 190, (190 * img.height) / img.width);
        imgCount++;

        // Check if we've processed all images
        if (imgCount === screenshots.length) {
          const filename = document.getElementById("filename-input").value || 'screenshots.pdf';
          pdf.save(filename);
        } else {
          pdf.addPage();
          addImageToPdf(screenshots[imgCount]); // Add the next image
        }
      };
    }

    if (screenshots.length > 0) {
      addImageToPdf(screenshots[0]); // Start adding images to PDF
    }
  });
});

