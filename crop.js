
  document.addEventListener('DOMContentLoaded', (event) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const imageUrl = urlParams.get('imgUrl');
  
    const imageElement = document.getElementById('image');
    if (!imageElement) {
        console.error('Image element not found');
        return;  // Exit early if the image element is not found
    }
    imageElement.src = imageUrl;
  
    const cropper = new Cropper(imageElement, {
        ready: function(event) {
            // The cropper is ready
        },
        error: function(event) {
            // An error occurred
            console.error('Cropper error:', event);
        }
    });

    const cropConfirmButton = document.getElementById('crop-confirm-button');
    if (!cropConfirmButton) {
        console.error('Crop confirm button not found');
        return;  // Exit early if the crop confirm button is not found
    }

    cropConfirmButton.addEventListener('click', () => {
        cropper.getCroppedCanvas().toBlob((blob) => {
            if (!blob) {
                console.error('Failed to get blob from cropped canvas');
                return;  // Exit early if blob is null or undefined
            }
            
            const reader = new FileReader();
            reader.onerror = () => {
                console.error('FileReader error:', reader.error);
            };
            reader.onload = () => {
                const croppedImageUrl = reader.result;
                chrome.runtime.sendMessage({ action: 'addModScreenshot', screenshotUrl: croppedImageUrl }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Failed to send message:', chrome.runtime.lastError);
                        return;
                    }
                    window.close();  // Close the cropping tab
                    console.log('Crop window is closed');
                });
            };
            reader.readAsDataURL(blob);
        });
    });
});
