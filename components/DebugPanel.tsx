"use client";

import { useState, useEffect } from "react";
import { troubleshootingTips, testQRCodes } from "../utils/testData";

interface DebugPanelProps {
  lastError?: string;
  scanCount: number;
}

export default function DebugPanel({ lastError, scanCount }: DebugPanelProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-semibold text-yellow-800">
          🔧 Troubleshooting & Debug Info
        </h3>
        <span className="text-yellow-600">{showDebug ? "▼" : "▶"}</span>
      </button>

      {showDebug && (
        <div className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">
                Debug Status:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>Total successful scans: {scanCount}</li>
                {isClient && (
                  <>
                    <li>
                      MediaDevices API:{" "}
                      {typeof navigator !== "undefined" &&
                      navigator.mediaDevices
                        ? "✅ Supported"
                        : "❌ Not supported"}
                    </li>
                    <li>
                      getUserMedia:{" "}
                      {typeof navigator !== "undefined" &&
                      navigator.mediaDevices &&
                      typeof navigator.mediaDevices.getUserMedia === "function"
                        ? "✅ Available"
                        : "❌ Not available"}
                    </li>
                    <li>
                      enumerateDevices:{" "}
                      {typeof navigator !== "undefined" &&
                      navigator.mediaDevices &&
                      typeof navigator.mediaDevices.enumerateDevices ===
                        "function"
                        ? "✅ Available"
                        : "❌ Not available"}
                    </li>
                    <li>
                      HTTPS required:{" "}
                      {typeof window !== "undefined" &&
                      (window.location.protocol === "https:" ||
                        window.location.hostname === "localhost")
                        ? "✅ OK"
                        : "⚠️ Camera may not work"}
                    </li>
                    {lastError && (
                      <li className="text-red-600">Last error: {lastError}</li>
                    )}
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-yellow-800 mb-2">
                Test QR Codes:
              </h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {testQRCodes.map((code, index) => (
                  <div
                    key={index}
                    className="border border-yellow-300 rounded p-2 bg-white"
                  >
                    <div className="font-medium">{code.description}</div>
                    <div className="text-xs text-gray-600">"{code.text}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-yellow-800 mb-2">
              Troubleshooting Tips:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {troubleshootingTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-yellow-600 mt-4 p-3 bg-yellow-100 rounded">
            <strong>If you're still having issues:</strong>
            <br />
            1. Try generating a simple QR code with "Hello World" text at
            qr-code-generator.com
            <br />
            2. Check browser console (F12) for detailed error messages
            <br />
            3. Try the "QR Codes Only" mode which is more reliable
            <br />
            4. Ensure you're testing with a clear, high-contrast QR code
          </div>
        </div>
      )}
    </div>
  );
}
