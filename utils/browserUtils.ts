// Mobile browser compatibility utilities

export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
};

export const getBrowserInfo = () => {
  if (typeof window === "undefined")
    return { name: "Unknown", version: "Unknown" };

  const ua = navigator.userAgent;

  if (ua.includes("Chrome")) {
    const match = ua.match(/Chrome\/(\d+)/);
    return { name: "Chrome", version: match ? match[1] : "Unknown" };
  }

  if (ua.includes("Firefox")) {
    const match = ua.match(/Firefox\/(\d+)/);
    return { name: "Firefox", version: match ? match[1] : "Unknown" };
  }

  if (ua.includes("Safari") && !ua.includes("Chrome")) {
    const match = ua.match(/Version\/(\d+)/);
    return { name: "Safari", version: match ? match[1] : "Unknown" };
  }

  if (ua.includes("Edge")) {
    const match = ua.match(/Edge\/(\d+)/);
    return { name: "Edge", version: match ? match[1] : "Unknown" };
  }

  return { name: "Unknown", version: "Unknown" };
};

export const getCameraPermissionHelp = () => {
  const browser = getBrowserInfo();
  const mobile = isMobile();

  if (mobile) {
    if (isIOS()) {
      return [
        "On iOS Safari: Go to Settings > Safari > Camera > Allow",
        "Make sure you're not in Private Browsing mode",
        "Try refreshing the page and allow camera access when prompted",
      ];
    } else if (isAndroid()) {
      return [
        "On Android Chrome: Tap the camera icon in the address bar",
        "Go to Settings > Site settings > Camera > Allow",
        "Make sure camera permissions are enabled for your browser",
      ];
    }
  }

  switch (browser.name) {
    case "Chrome":
      return [
        "Click the camera icon in the address bar",
        "Go to Chrome Settings > Privacy and security > Site Settings > Camera",
        "Make sure this site is allowed to use your camera",
      ];
    case "Firefox":
      return [
        "Click the shield icon in the address bar",
        "Go to Firefox Preferences > Privacy & Security > Permissions > Camera",
        "Remove this site from blocked list if present",
      ];
    case "Safari":
      return [
        "Go to Safari > Preferences > Websites > Camera",
        'Set this website to "Allow"',
        "Refresh the page",
      ];
    default:
      return [
        "Look for a camera icon in your browser's address bar",
        "Check your browser's privacy/security settings",
        "Make sure camera access is allowed for this website",
      ];
  }
};

export const getMinimumVersions = () => {
  return {
    chrome: 53,
    firefox: 36,
    safari: 11,
    edge: 12,
  };
};
