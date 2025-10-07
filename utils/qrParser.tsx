// QR Code data parsing utilities
import React from "react";

export interface ParsedQRData {
  type: "url" | "email" | "phone" | "sms" | "wifi" | "contact" | "text" | "geo";
  raw: string;
  parsed: any;
  displayName: string;
}

export const parseQRData = (data: string): ParsedQRData => {
  const trimmedData = data.trim();

  // URL detection
  if (trimmedData.match(/^(https?|ftp):\/\//i)) {
    return {
      type: "url",
      raw: data,
      parsed: { url: trimmedData },
      displayName: "Website URL",
    };
  }

  // Email detection
  if (trimmedData.match(/^mailto:/i)) {
    const email = trimmedData.replace(/^mailto:/i, "");
    const [address, params] = email.split("?");
    const urlParams = new URLSearchParams(params || "");

    return {
      type: "email",
      raw: data,
      parsed: {
        email: address,
        subject: urlParams.get("subject") || "",
        body: urlParams.get("body") || "",
      },
      displayName: "Email Address",
    };
  }

  // Phone number detection
  if (trimmedData.match(/^tel:/i)) {
    const phone = trimmedData.replace(/^tel:/i, "");
    return {
      type: "phone",
      raw: data,
      parsed: { phone },
      displayName: "Phone Number",
    };
  }

  // SMS detection
  if (trimmedData.match(/^sms:/i)) {
    const smsData = trimmedData.replace(/^sms:/i, "");
    const [phone, message] = smsData.split("?body=");

    return {
      type: "sms",
      raw: data,
      parsed: {
        phone: phone.replace(/[?:].*/, ""),
        message: decodeURIComponent(message || ""),
      },
      displayName: "SMS Message",
    };
  }

  // WiFi detection
  if (trimmedData.match(/^WIFI:/i)) {
    const wifiMatch = trimmedData.match(
      /WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);?/i
    );
    if (wifiMatch) {
      return {
        type: "wifi",
        raw: data,
        parsed: {
          security: wifiMatch[1] || "None",
          ssid: wifiMatch[2] || "",
          password: wifiMatch[3] || "",
          hidden: wifiMatch[4] === "true",
        },
        displayName: "WiFi Network",
      };
    }
  }

  // Contact/vCard detection
  if (trimmedData.match(/^BEGIN:VCARD/i)) {
    const lines = trimmedData.split(/\r?\n/);
    const contact: any = {};

    lines.forEach((line) => {
      if (line.includes("FN:")) contact.name = line.split("FN:")[1];
      if (line.includes("ORG:")) contact.organization = line.split("ORG:")[1];
      if (line.includes("TEL:")) contact.phone = line.split("TEL:")[1];
      if (line.includes("EMAIL:")) contact.email = line.split("EMAIL:")[1];
      if (line.includes("URL:")) contact.website = line.split("URL:")[1];
    });

    return {
      type: "contact",
      raw: data,
      parsed: contact,
      displayName: "Contact Information",
    };
  }

  // Geographic location detection
  if (trimmedData.match(/^geo:/i)) {
    const geoMatch = trimmedData.match(/geo:([^,]+),([^,?]+)(?:\?(.*))?/i);
    if (geoMatch) {
      return {
        type: "geo",
        raw: data,
        parsed: {
          latitude: parseFloat(geoMatch[1]),
          longitude: parseFloat(geoMatch[2]),
          query: geoMatch[3] || "",
        },
        displayName: "Geographic Location",
      };
    }
  }

  // Default to text
  return {
    type: "text",
    raw: data,
    parsed: { text: trimmedData },
    displayName: "Text Content",
  };
};

export const formatQRDataForDisplay = (
  parsedData: ParsedQRData
): React.ReactElement => {
  const { type, parsed } = parsedData;

  switch (type) {
    case "url":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">🌐 URL:</span>
            <a
              href={parsed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {parsed.url}
            </a>
          </div>
        </div>
      );

    case "email":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">
              📧 Email:
            </span>
            <a
              href={`mailto:${parsed.email}`}
              className="text-green-600 hover:text-green-800 underline"
            >
              {parsed.email}
            </a>
          </div>
          {parsed.subject && (
            <div className="text-sm text-gray-600">
              <strong>Subject:</strong> {parsed.subject}
            </div>
          )}
          {parsed.body && (
            <div className="text-sm text-gray-600">
              <strong>Message:</strong> {parsed.body}
            </div>
          )}
        </div>
      );

    case "phone":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">
              📞 Phone:
            </span>
            <a
              href={`tel:${parsed.phone}`}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              {parsed.phone}
            </a>
          </div>
        </div>
      );

    case "sms":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-indigo-600">💬 SMS:</span>
            <a
              href={`sms:${parsed.phone}${
                parsed.message
                  ? `?body=${encodeURIComponent(parsed.message)}`
                  : ""
              }`}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              {parsed.phone}
            </a>
          </div>
          {parsed.message && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Message:</strong> {parsed.message}
            </div>
          )}
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-cyan-600">
              📶 WiFi Network:
            </span>
          </div>
          <div className="bg-cyan-50 p-3 rounded-lg space-y-1">
            <div>
              <strong>Network:</strong> {parsed.ssid}
            </div>
            <div>
              <strong>Security:</strong> {parsed.security}
            </div>
            {parsed.password && (
              <div>
                <strong>Password:</strong>{" "}
                <code className="bg-gray-200 px-1 rounded">
                  {parsed.password}
                </code>
              </div>
            )}
            {parsed.hidden && (
              <div className="text-sm text-gray-600">Hidden network</div>
            )}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-orange-600">
              👤 Contact:
            </span>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg space-y-1">
            {parsed.name && (
              <div>
                <strong>Name:</strong> {parsed.name}
              </div>
            )}
            {parsed.organization && (
              <div>
                <strong>Organization:</strong> {parsed.organization}
              </div>
            )}
            {parsed.phone && (
              <div>
                <strong>Phone:</strong>
                <a
                  href={`tel:${parsed.phone}`}
                  className="ml-1 text-orange-600 hover:text-orange-800 underline"
                >
                  {parsed.phone}
                </a>
              </div>
            )}
            {parsed.email && (
              <div>
                <strong>Email:</strong>
                <a
                  href={`mailto:${parsed.email}`}
                  className="ml-1 text-orange-600 hover:text-orange-800 underline"
                >
                  {parsed.email}
                </a>
              </div>
            )}
            {parsed.website && (
              <div>
                <strong>Website:</strong>
                <a
                  href={parsed.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-orange-600 hover:text-orange-800 underline"
                >
                  {parsed.website}
                </a>
              </div>
            )}
          </div>
        </div>
      );

    case "geo":
      const mapUrl = `https://www.google.com/maps?q=${parsed.latitude},${parsed.longitude}`;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-red-600">
              📍 Location:
            </span>
          </div>
          <div className="bg-red-50 p-3 rounded-lg space-y-1">
            <div>
              <strong>Latitude:</strong> {parsed.latitude}
            </div>
            <div>
              <strong>Longitude:</strong> {parsed.longitude}
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              🗺️ View on Maps
            </a>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">📝 Text:</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">
              {parsed.text}
            </pre>
          </div>
        </div>
      );
  }
};
