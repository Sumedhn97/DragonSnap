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


// Function to clear the screenshots from the background script
function clearScreenshots(callback) {
  chrome.runtime.sendMessage({ action: "clearScreenshots" }, function(response) {
    callback(response.status);
  });
}


// Capture and add a screenshot
document.getElementById("screenshot-button").addEventListener("click", function() {
  // Get the button element
  var button = document.getElementById("screenshot-button");
  
  // Disable the button to prevent further clicks
  button.disabled = true;

  // Delay the screenshot capture by 1 second (1000 milliseconds)
  setTimeout(function() {
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

      // Re-enable the button after the timeout has elapsed
      button.disabled = false;
  }, 1000);  // 1000 milliseconds delay
});



// Generate PDF using stored screenshots
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
  const filename = document.getElementById("filename-input").value || 'screenshots.pdf';
  pdf.save(filename);

  clearScreenshots(function(status) {
      console.log(status);  // Logs "Screenshots cleared"
  });
}
