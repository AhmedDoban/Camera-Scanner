"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  BrowserQRCodeReader,
} from "@zxing/library";

interface CameraScannerProps {
  onScanSuccess: (result: string, screenshot?: string) => void;
  onScanError?: (error: Error) => void;
  width?: number;
  height?: number;
  autoStop?: boolean;
  captureScreenshot?: boolean;
}

export default function CameraScanner({
  onScanSuccess,
  onScanError,
  width = 400,
  height = 300,
  autoStop = true,
  captureScreenshot = true,
}: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [useQROnly, setUseQROnly] = useState(false);
  const [autoStopEnabled, setAutoStopEnabled] = useState(autoStop);
  const [screenshotEnabled, setScreenshotEnabled] = useState(captureScreenshot);
  const [lastScreenshot, setLastScreenshot] = useState<string>("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const qrReaderRef = useRef<BrowserQRCodeReader | null>(null);

  // Initialize the code readers
  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.CODABAR,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.ITF,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    try {
      readerRef.current = new BrowserMultiFormatReader(hints);
      qrReaderRef.current = new BrowserQRCodeReader();
    } catch (err) {
      console.error("Error initializing readers:", err);
      setError("Failed to initialize scanners");
    }

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (qrReaderRef.current) {
        qrReaderRef.current.reset();
      }
    };
  }, []);

  // Get available video devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.enumerateDevices
        ) {
          setError("Camera API not supported");
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        } else {
          setError("No cameras found");
        }
      } catch (err) {
        console.error("Error getting devices:", err);
        setError("Could not access camera devices");
      }
    };

    getDevices();
  }, []);

  const captureScreenshotFromVideo = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  };

  const startScanning = async () => {
    if (!selectedDeviceId) {
      setError("No camera selected");
      return;
    }

    setError("");
    setIsScanning(true);

    try {
      const currentReader = useQROnly ? qrReaderRef.current : readerRef.current;
      if (!currentReader) {
        throw new Error("Scanner not initialized");
      }

      await currentReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            console.log("Scanned:", result.getText());

            let screenshot: string | undefined;
            if (screenshotEnabled) {
              screenshot = captureScreenshotFromVideo() || undefined;
              if (screenshot) {
                setLastScreenshot(screenshot);
              }
            }

            onScanSuccess(result.getText(), screenshot);

            if (autoStopEnabled) {
              stopScanning();
            }
          }
          if (error) {
            const errorMessage = error?.message || error?.toString() || "";
            const isNormalScanError =
              errorMessage.toLowerCase().includes("no multiformat reader") ||
              errorMessage.toLowerCase().includes("not found") ||
              errorMessage.toLowerCase().includes("no code found");

            if (!isNormalScanError && errorMessage) {
              console.error("Scan error:", error);
              if (onScanError) {
                onScanError(error);
              }
            }
          }
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError(
        `Could not start camera: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setIsScanning(false);
      if (onScanError && err instanceof Error) {
        onScanError(err);
      }
    }
  };

  const stopScanning = () => {
    try {
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (qrReaderRef.current) {
        qrReaderRef.current.reset();
      }
      setIsScanning(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  return (
    <div className="backdrop-blur-xl rounded-3xl border border-white/50 space-y-8">
      {/* Camera Preview */}
      <div className="relative flex justify-center w-full">
        <div className="relative">
          <video
            ref={videoRef}
            className="rounded-2xl border-2 border-white/30 shadow-xl w-full max-w-full h-auto backdrop-blur-sm"
            style={{
              display: isScanning ? "block" : "none",
              maxWidth: `${width}px`,
              maxHeight: `${height}px`,
            }}
          />

          {/* Hidden canvas for screenshots */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Placeholder when not scanning */}
          {!isScanning && !lastScreenshot && (
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50"
              style={{
                maxWidth: `${width}px`,
                height: `${Math.min(height, 250)}px`,
              }}
            >
              <div className="text-indigo-400 mb-6">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Ready to Scan
              </h3>
              <p className="text-gray-600 text-center px-6 leading-relaxed">
                Click "Start Scanning" to begin capturing codes
              </p>
            </div>
          )}

          {/* Last screenshot preview */}
          {lastScreenshot && !isScanning && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Last Screenshot
              </h4>
              <img
                src={lastScreenshot}
                alt="Last scanned code"
                className="rounded-2xl border-2 border-white/30 shadow-xl max-w-full h-auto"
                style={{ maxWidth: width, maxHeight: height }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      {devices.length > 1 && (
        <div className="space-y-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span className="text-xl">📹</span>
            Camera Selection
          </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-md text-gray-800 font-medium"
            disabled={isScanning}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
          <input
            type="checkbox"
            checked={useQROnly}
            onChange={(e) => setUseQROnly(e.target.checked)}
            disabled={isScanning}
            className="w-5 h-5 rounded-lg border-2 border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          />
          <span className="font-medium text-blue-800">📱 QR Only Mode</span>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
          <input
            type="checkbox"
            checked={autoStopEnabled}
            onChange={(e) => setAutoStopEnabled(e.target.checked)}
            disabled={isScanning}
            className="w-5 h-5 rounded-lg border-2 border-green-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
          />
          <span className="font-medium text-green-800">⏹️ Auto-stop</span>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
          <input
            type="checkbox"
            checked={screenshotEnabled}
            onChange={(e) => setScreenshotEnabled(e.target.checked)}
            disabled={isScanning}
            className="w-5 h-5 rounded-lg border-2 border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
          />
          <span className="font-medium text-purple-800">📸 Screenshots</span>
        </label>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={startScanning}
          disabled={isScanning || devices.length === 0}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          {isScanning ? (
            <span className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Scanning...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Start Scanning
            </span>
          )}
        </button>

        {isScanning && (
          <>
            <button
              onClick={stopScanning}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">⏹️</span>
                Stop
              </span>
            </button>
            <button
              onClick={() => {
                const screenshot = captureScreenshotFromVideo();
                if (screenshot) {
                  setLastScreenshot(screenshot);
                  onScanSuccess("Manual Screenshot", screenshot);
                }
              }}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-2xl">📸</span>
            </button>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200/50 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <span className="text-red-700 font-semibold">Error:</span>
              <span className="text-red-600 ml-2">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Info */}
      <div className="flex flex-wrap gap-3 justify-center">
        <span
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            useQROnly
              ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-200"
          }`}
        >
          {useQROnly ? "📱 QR Only" : "🔍 All Formats"}
        </span>
        <span
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            autoStopEnabled
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
              : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200"
          }`}
        >
          {autoStopEnabled ? "⏹️ Auto-stop" : "🔄 Continuous"}
        </span>
        {screenshotEnabled && (
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 font-medium text-sm">
            📸 Screenshots
          </span>
        )}
      </div>
    </div>
  );
}
