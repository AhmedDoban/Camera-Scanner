"use client";

import React from "react";
import {
  parseQRData,
  formatQRDataForDisplay,
  ParsedQRData,
} from "../utils/qrParser";

interface QRDataDisplayProps {
  data: string;
  timestamp: Date;
  screenshot?: string;
}

export const QRDataDisplay: React.FC<QRDataDisplayProps> = ({
  data,
  timestamp,
  screenshot,
}) => {
  const parsedData: ParsedQRData = parseQRData(data);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      url: "from-blue-500 to-blue-600",
      email: "from-green-500 to-green-600",
      phone: "from-purple-500 to-purple-600",
      sms: "from-indigo-500 to-indigo-600",
      wifi: "from-cyan-500 to-cyan-600",
      contact: "from-orange-500 to-orange-600",
      geo: "from-red-500 to-red-600",
      text: "from-gray-500 to-gray-600",
    };
    return colors[type] || colors.text;
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      url: "🌐",
      email: "📧",
      phone: "📞",
      sms: "💬",
      wifi: "📶",
      contact: "👤",
      geo: "📍",
      text: "📝",
    };
    return icons[type] || icons.text;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 hover:shadow-3xl transition-all">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${getTypeColor(
          parsedData.type
        )} text-white p-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/25 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-3xl">{getTypeIcon(parsedData.type)}</span>
            </div>
            <div>
              <h3 className="font-bold text-2xl mb-2 tracking-tight">
                {parsedData.displayName}
              </h3>
              <p className="text-white/90 flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  {timestamp.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-4 py-2 bg-white/25 backdrop-blur-lg rounded-full font-bold text-sm tracking-wider border border-white/30 shadow-lg">
              {parsedData.type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Parsed Data Display */}
        <div className="">{formatQRDataForDisplay(parsedData)}</div>

        {/* Expandable Sections */}
        <div className="space-y-6">
          {/* Raw Data Collapsible */}
          <details className="group border-b border-gray-200 pb-4">
            <summary className="cursor-pointer p-4 hover:bg-gray-50 transition-colors select-none flex items-center gap-3 font-medium text-gray-700">
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-90 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>View Raw Data</span>
            </summary>
            <div className="px-6 pb-6">
              <pre className="whitespace-pre-wrap break-all font-mono text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg">
                {data}
              </pre>
            </div>
          </details>

          {/* Screenshot */}
          {screenshot && (
            <details className="group border-b border-gray-200 pb-4">
              <summary className="cursor-pointer p-4 hover:bg-gray-50 transition-colors select-none flex items-center gap-3 font-medium text-gray-700">
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-90 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>View Screenshot</span>
              </summary>
              <div className="px-6 pb-6">
                <img
                  src={screenshot}
                  alt="QR Code Screenshot"
                  className="w-full h-auto max-w-sm mx-auto rounded-lg shadow-md"
                />
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(data);
              // Could add toast notification here
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Text
          </button>

          {parsedData.type === "url" && (
            <button
              onClick={() => window.open(parsedData.parsed.url, "_blank")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open URL
            </button>
          )}

          {screenshot && (
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = screenshot;
                link.download = `qr-screenshot-${Date.now()}.png`;
                link.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Save Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
