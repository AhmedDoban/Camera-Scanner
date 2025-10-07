// Test QR Code: Simple text QR code for testing
// You can generate a QR code with the text "Hello World" at https://qr-code-generator.com/
// Or use this test string: "TEST123456789"

export const testQRCodes = [
  {
    text: "Hello World",
    description: "Simple text QR code",
  },
  {
    text: "https://www.google.com",
    description: "URL QR code",
  },
  {
    text: "TEST123456789",
    description: "Alphanumeric test string",
  },
  {
    text: "1234567890",
    description: "Numeric barcode",
  },
];

export const troubleshootingTips = [
  "Ensure good lighting - avoid shadows and glare",
  "Hold the camera steady and at the right distance (6-12 inches)",
  "Make sure the QR code fills about 1/4 to 1/2 of the camera view",
  "Try the 'QR Codes Only' mode for better QR code detection",
  "Clean your camera lens",
  "If using a phone, try rotating it to landscape mode",
  "Make sure the QR code is flat and not curved or wrinkled",
  "Try different angles if the code isn't being detected",
];
