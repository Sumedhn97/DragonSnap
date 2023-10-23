# DragonSnap

## Overview

DragonSnap, a robust Chrome extension built on Manifest V3, revolutionizes the way you capture content. It empowers you to seamlessly take screenshots across multiple web pages, consolidate them into a single document, and directly save them as a PDF on your device. DragonSnap eliminates the complexities of traditional screen capture solutions, offering a user-friendly alternative.

Originally crafted in the research division of Pacific Alliance Ventures, DragonSnap played a crucial role in assembling training and fine-tuning datasets for our advanced multi-modal Large Language Models (LLMs). We expect to open-source more of these tools for the community in the near future!

## Features

- **Easy Capturing:** Grab screenshots of your active tab with just a click.
- **Compiling Screenshots:** Merge multiple captures into a single, convenient PDF file.
- **Direct Downloads:** Save your compiled PDFs directly to your device with ease.

## How It Works

DragonSnap uses a simple, user-friendly interface to manage the screenshot process:

1. **Click** the DragonSnap icon in your browser's toolbar.
2. **Capture** the screenshot from your active webpage.
3. The extension will **compile** the screenshots into a PDF.
4. **Download** the PDF directly to your local storage.

## Permissions

- `activeTab`: Allows DragonSnap to see the URL of the navigation entries of the tab, and to temporarily interact with it, ensuring accurate and efficient screenshot capture.
- `downloads`: Enables the extension to save the compiled PDF files directly to your device without hassle.

## Files

- `background.js`: Essential background script for handling core extension activities.
- `icon.png`: Icon image for the extension, displayed in the browser toolbar.
- `popup.html`: Markup file that structures the user interface when the extension icon is clicked in the toolbar.
- `popup.js`: Script that manages the behavior and events for the popup UI, enhancing interactivity.
- `jspdf.umd.min.js`: Minified script library that enables the creation of PDF documents from the captured screenshots.

## Installation

Currently, DragonSnap is not available on the official web store. However, you can manually install the unpacked extension in developer mode. Here's how:

1. Download or clone the repository to your local machine.
2. Open your browser and navigate to the extensions page (usually found at `chrome://extensions`).
3. Enable "Developer mode."
4. Choose "Load unpacked" and select the `DragonSnap` directory.

Voila! You're all set to capture, compile, and download with DragonSnap!

## License

DragonSnap is licensed under the MIT license. For more information, please refer to the [license](LICENSE) file in the repository.
