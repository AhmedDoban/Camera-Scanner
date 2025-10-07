"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CameraScanner from "@/components/CameraScanner";
import DebugPanel from "@/components/DebugPanel";
import { QRDataDisplay } from "../components/QRDataDisplay";

// Dynamic import to prevent SSR issues
const BrowserCompatibility = dynamic(
  () => import("../components/BrowserCompatibility"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
    ),
  }
);

interface ScanResult {
  text: string;
  screenshot?: string;
  timestamp: Date;
}

export default function Home() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [lastError, setLastError] = useState<string>("");
  const [isBrowserCompatible, setIsBrowserCompatible] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScanSuccess = (result: string, screenshot?: string) => {
    const newResult: ScanResult = {
      text: result,
      screenshot,
      timestamp: new Date(),
    };
    setScanResult(newResult);
    setLastError(""); // Clear any previous errors
    console.log("Scanned result:", result, screenshot ? "with screenshot" : "");
  };

  const handleScanError = (error: Error) => {
    let errorMessage = "Unknown scan error";
    try {
      errorMessage =
        error?.message || error?.toString() || "Unknown scan error";
    } catch (e) {
      errorMessage = "Error processing scan error";
    }

    setLastError(errorMessage);
    console.error("Scan error:", error);
  };

  const clearResult = () => {
    setScanResult(null);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            QR & Barcode Scanner
          </h1>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 shadow-2xl border border-white/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            QR Scanner
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Modern QR code scanning with intelligent data parsing and beautiful results
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30">
            <span className="text-2xl">✨</span>
            <span className="font-semibold">Advanced Code Recognition</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        {/* Browser Compatibility Check */}
        <div className="mb-8">
          <BrowserCompatibility onCompatibilityCheck={setIsBrowserCompatible} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Scanner Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Camera Scanner</h2>
                  <p className="text-gray-600 mt-1">Point your camera at any QR code or barcode</p>
                </div>
              </div>

              <div className="flex justify-center">
                {isBrowserCompatible ? (
                  <div className="w-full">
                    <CameraScanner
                      onScanSuccess={handleScanSuccess}
                      onScanError={handleScanError}
                      width={400}
                      height={300}
                    />
                  </div>
                ) : (
                  <div className="w-full p-8 border-2 border-dashed border-red-200 rounded-2xl text-center bg-gradient-to-br from-red-50 to-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                      Scanner Unavailable
                    </h3>
                    <p className="text-red-600">
                      Browser compatibility issues detected. Please check the warning above.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modern Instructions Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-200/50 p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 18 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">How to Use</h3>
                  <p className="text-blue-600/80">Simple steps to start scanning</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "🎯", text: "Click 'Start Scanning' to activate camera" },
                  { icon: "🛡️", text: "Allow camera permissions when prompted" },
                  { icon: "📱", text: "Point camera at QR code or barcode" },
                  { icon: "⚡", text: "Scanner automatically detects codes" },
                  { icon: "✨", text: "Result appears with smart formatting" },
                  { icon: "📷", text: "Switch cameras if you have multiple" },
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-2xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-sm">{instruction.icon}</span>
                    </div>
                    <span className="text-sm text-blue-800 font-medium leading-relaxed">{instruction.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Scan Results</h2>
                    <p className="text-gray-600 mt-1">Intelligent parsing and beautiful formatting</p>
                  </div>
                </div>
                {scanResult && (
                  <button
                    onClick={clearResult}
                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>

              {scanResult ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <QRDataDisplay
                    data={scanResult.text}
                    timestamp={scanResult.timestamp}
                    screenshot={scanResult.screenshot}
                  />
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Scan</h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">Start scanning to see your results with intelligent parsing and beautiful formatting</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="mt-8">
          <DebugPanel lastError={lastError} scanCount={scanResult ? 1 : 0} />
        </div>
      </div>
    </div>
  );
}
