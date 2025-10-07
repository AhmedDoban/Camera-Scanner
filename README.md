# 📱 QR & Barcode Scanner

A modern, responsive web-based QR code and barcode scanner built with Next.js, TypeScript, and Tailwind CSS. This application provides real-time scanning capabilities using your device's camera with advanced features like auto-stop, screenshot capture, and comprehensive browser compatibility checking.

## ✨ Features

### 🔍 **Scanning Capabilities**

- **Multi-format Support**: Scans QR codes, Data Matrix, Code 128, Code 39, EAN-13, UPC-A, PDF417, Aztec, and more
- **QR-Only Mode**: Optimized scanning mode specifically for QR codes
- **Real-time Detection**: Continuous scanning with instant results
- **Auto-stop Functionality**: Automatically stops camera after successful scan
- **Manual Screenshot**: Take pictures anytime during scanning
- **URL Recognition**: Automatically detects and provides clickable links for URLs

### 📸 **Screenshot & Media Features**

- **Automatic Screenshot Capture**: Takes pictures of detected codes
- **High-Quality Images**: Captures screenshots in JPEG format
- **Visual Results**: Display scanned codes alongside their screenshots
- **Responsive Images**: Screenshots adapt to different screen sizes

### 📱 **Device & Browser Support**

- **Multi-Camera Support**: Choose between front and back cameras
- **Mobile Optimized**: Fully responsive design for all screen sizes
- **Browser Compatibility**: Works on Chrome 53+, Firefox 36+, Safari 11+, Edge 12+
- **HTTPS Support**: Secure connection for camera access
- **Progressive Enhancement**: Graceful degradation for unsupported browsers

### 🎨 **User Interface**

- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Responsive Layout**: Adapts to mobile, tablet, and desktop screens
- **Dark/Light Elements**: Proper contrast and accessibility
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Comprehensive error messages and troubleshooting tips

### 🧠 **Smart QR Data Parsing**

- **Automatic Type Detection**: Recognizes URLs, emails, phone numbers, WiFi credentials, contacts, and more
- **Formatted Display**: Each data type is displayed with appropriate icons, colors, and formatting
- **Interactive Elements**: Clickable links, phone numbers, and email addresses
- **Action Buttons**: Context-aware actions like "Open URL", "Call Number", "Connect to WiFi"
- **Raw Data View**: Collapsible section to view the original QR code content
- **Copy & Share**: Easy copying of text and downloading of screenshots

### 🛠 **Advanced Features**

- **Browser Compatibility Check**: Automatic detection of required APIs
- **Debug Panel**: Comprehensive troubleshooting information
- **Camera Permissions Guide**: Step-by-step instructions for different browsers
- **Mobile-Specific Help**: Tailored guidance for iOS and Android devices
- **Performance Optimized**: Fast scanning with efficient resource usage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Modern web browser with camera support
- HTTPS connection (for camera access)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd camera
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `https://localhost:3000` (note: HTTPS is required for camera access)

## 📋 Usage

### Basic Scanning

1. **Allow Camera Access**: Grant camera permissions when prompted
2. **Start Scanning**: Click "Start Scanning" to activate the camera
3. **Position Code**: Point your camera at a QR code or barcode
4. **View Results**: The scanned content appears instantly with optional screenshot

### Advanced Options

- **QR Codes Only**: Toggle for optimized QR code detection
- **Auto-stop**: Automatically stops camera after successful scan
- **Screenshot Capture**: Automatically takes pictures of detected codes
- **Camera Selection**: Choose between multiple cameras if available

### Mobile Usage

- **Portrait/Landscape**: Works in both orientations
- **Touch-Friendly**: Large buttons and easy navigation
- **Responsive Design**: Optimized for small screens

## 📋 Supported QR Data Types

The scanner automatically detects and formats various QR code data types:

### 🌐 **Website URLs**

- **Format**: `https://example.com`
- **Display**: Clickable link with globe icon
- **Actions**: Open in new tab, copy URL

### 📧 **Email Addresses**

- **Format**: `mailto:user@example.com?subject=Hello&body=Message`
- **Display**: Clickable email with subject/body preview
- **Actions**: Open email client, copy address

### 📞 **Phone Numbers**

- **Format**: `tel:+1-555-123-4567`
- **Display**: Clickable phone number with phone icon
- **Actions**: Initiate call, copy number

### 💬 **SMS Messages**

- **Format**: `sms:+1-555-123-4567?body=Hello`
- **Display**: Phone number with message preview
- **Actions**: Open messaging app, copy details

### 📶 **WiFi Networks**

- **Format**: `WIFI:T:WPA;S:NetworkName;P:password;H:false;`
- **Display**: Network details with security info
- **Actions**: Copy credentials, view password

### 👤 **Contact Information (vCard)**

- **Format**: Standard vCard format with BEGIN:VCARD
- **Display**: Formatted contact card with all details
- **Actions**: Click phone/email/website links

### 📍 **Geographic Locations**

- **Format**: `geo:latitude,longitude?q=location`
- **Display**: Coordinates with location info
- **Actions**: View on Google Maps, copy coordinates

### 📝 **Plain Text**

- **Format**: Any text content
- **Display**: Formatted text with proper line breaks
- **Actions**: Copy text, view raw content

## 🏗 Technical Architecture

### Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ZXing Library](https://github.com/zxing-js/library)** - Barcode/QR code scanning
- **React 19** - Latest React features

### Key Components

- **CameraScanner**: Main scanning component with camera controls
- **BrowserCompatibility**: Compatibility checking and guidance
- **DebugPanel**: Troubleshooting and diagnostic information
- **Mobile Detection**: Device-specific optimizations

### Browser APIs Used

- **MediaDevices API**: Camera access and device enumeration
- **getUserMedia**: Video stream capture
- **Canvas API**: Screenshot capture and image processing

## 🔧 Configuration

### Environment Setup

The project includes HTTPS support for development:

```json
{
  "scripts": {
    "dev": "next dev --turbopack --experimental-https"
  }
}
```

### Supported Formats

- QR Code
- Data Matrix
- Code 128, Code 39, Code 93
- EAN-13, EAN-8
- UPC-A, UPC-E
- PDF417
- Aztec
- Codabar
- ITF (Interleaved 2 of 5)

## 📱 Browser Compatibility

### Minimum Versions

| Browser | Version | Mobile Support |
| ------- | ------- | -------------- |
| Chrome  | 53+     | ✅ Android     |
| Firefox | 36+     | ✅ Android     |
| Safari  | 11+     | ✅ iOS         |
| Edge    | 12+     | ✅ Windows     |

### Required Features

- ✅ MediaDevices API
- ✅ getUserMedia
- ✅ enumerateDevices
- ✅ HTTPS/Localhost
- ✅ Canvas API

## 🚨 Troubleshooting

### Common Issues

**Camera Not Working**

- Ensure HTTPS connection
- Check browser permissions
- Try different camera (front/back)
- Disable private/incognito mode

**Scanning Not Detecting**

- Improve lighting conditions
- Hold code steady at proper distance
- Try "QR Codes Only" mode
- Clean camera lens

**Mobile Issues**

- Rotate device to landscape
- Refresh the page
- Check camera permissions in browser settings

### Debug Information

The app includes a comprehensive debug panel showing:

- Browser compatibility status
- API availability
- Permission status
- Device information
- Error logs

## 🔒 Privacy & Security

- **No Data Storage**: Scanned content is only stored locally in browser memory
- **No Server Communication**: All processing happens client-side
- **Camera Access**: Only used for scanning, not recorded or transmitted
- **HTTPS Required**: Secure connection for camera access
- **No Tracking**: No analytics or user tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [ZXing Library](https://github.com/zxing-js/library) - Excellent barcode scanning library
- [Next.js Team](https://nextjs.org/) - Amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful utility-first CSS

---

**Made with ❤️ for seamless QR code and barcode scanning**
