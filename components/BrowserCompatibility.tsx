"use client";

import { useEffect, useState } from "react";
import {
  isMobile,
  getBrowserInfo,
  getCameraPermissionHelp,
  getMinimumVersions,
} from "../utils/browserUtils";

interface BrowserCompatibilityProps {
  onCompatibilityCheck: (isCompatible: boolean) => void;
}

export default function BrowserCompatibility({
  onCompatibilityCheck,
}: BrowserCompatibilityProps) {
  const [isClient, setIsClient] = useState(false);
  const [compatibility, setCompatibility] = useState<{
    mediaDevices: boolean;
    getUserMedia: boolean;
    enumerateDevices: boolean;
    isHttps: boolean;
    overall: boolean;
  }>({
    mediaDevices: false,
    getUserMedia: false,
    enumerateDevices: false,
    isHttps: false,
    overall: false,
  });

  // Ensure we only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkCompatibility = () => {
      const mediaDevices =
        typeof navigator !== "undefined" && !!navigator.mediaDevices;
      const getUserMedia =
        typeof navigator !== "undefined" &&
        !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const enumerateDevices =
        typeof navigator !== "undefined" &&
        !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
      const isHttps =
        typeof window !== "undefined" &&
        (window.location.protocol === "https:" ||
          window.location.hostname === "localhost");

      const overall =
        mediaDevices && getUserMedia && enumerateDevices && isHttps;

      const result = {
        mediaDevices,
        getUserMedia,
        enumerateDevices,
        isHttps,
        overall,
      };

      setCompatibility(result);
      onCompatibilityCheck(overall);
    };

    checkCompatibility();
  }, [isClient, onCompatibilityCheck]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  if (compatibility.overall) {
    return null; // Don't show anything if everything is compatible
  }

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="font-semibold text-red-800 mb-3">
        ⚠️ Browser Compatibility Issues
      </h3>

      <div className="space-y-2 text-sm">
        {!compatibility.mediaDevices && (
          <p className="text-red-700">
            ❌ <strong>MediaDevices API</strong> is not supported in this
            browser.
          </p>
        )}

        {!compatibility.getUserMedia && (
          <p className="text-red-700">
            ❌ <strong>getUserMedia</strong> is not available.
          </p>
        )}

        {!compatibility.enumerateDevices && (
          <p className="text-red-700">
            ❌ <strong>enumerateDevices</strong> is not available.
          </p>
        )}

        {!compatibility.isHttps && (
          <p className="text-red-700">
            ❌ <strong>HTTPS required</strong> - Camera access requires a secure
            connection.
          </p>
        )}
      </div>

      <div className="mt-4 p-3 bg-red-100 rounded">
        <h4 className="font-medium text-red-800 mb-2">Solutions:</h4>
        <ul className="text-sm text-red-700 space-y-1">
          {!compatibility.isHttps && (
            <li>• Use HTTPS or localhost for camera access</li>
          )}
          {!compatibility.mediaDevices && (
            <li>
              • Update to a modern browser (Chrome 53+, Firefox 36+, Safari 11+)
            </li>
          )}
          <li>• Try a different browser or device</li>
          <li>• Check if camera permissions are blocked</li>
          {isMobile() && (
            <>
              <li>• On mobile: ensure you're not in private/incognito mode</li>
              <li>• Try rotating your device or refreshing the page</li>
            </>
          )}
        </ul>

        {compatibility.mediaDevices && compatibility.getUserMedia && (
          <div className="mt-3">
            <h5 className="font-medium text-red-800 mb-1">
              Camera Permission Help:
            </h5>
            <ul className="text-xs text-red-600 space-y-1">
              {getCameraPermissionHelp().map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-red-600">
        <div className="flex justify-between items-center">
          <span>
            <strong>Your browser:</strong> {getBrowserInfo().name}{" "}
            {getBrowserInfo().version}
          </span>
          <span>
            <strong>Mobile:</strong> {isMobile() ? "Yes" : "No"}
          </span>
        </div>
        <div className="mt-1">
          <strong>Minimum versions:</strong> Chrome 53+, Firefox 36+, Safari
          11+, Edge 12+
        </div>
      </div>
    </div>
  );
}
