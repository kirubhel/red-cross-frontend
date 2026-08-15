/**
 * Web Push Notification Management for ERCS Desktop & PWA
 */

export interface PushNotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

/**
 * Checks whether the current browser environment supports Push Notifications & Service Workers.
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "Notification" in window && "PushManager" in window;
}

/**
 * Returns the current notification permission state.
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Requests desktop notification permission from the user.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications are not supported by this browser.");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Dispatches a test desktop notification via the active Service Worker registration.
 */
export async function showTestDesktopNotification(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  if (Notification.permission !== "granted") {
    const res = await requestNotificationPermission();
    if (res !== "granted") return false;
  }

  const registration = await navigator.serviceWorker.ready;
  if (!registration) {
    new Notification("ERCS Desktop Alert", {
      body: "Desktop notifications are enabled and ready!",
      icon: "/logo.png",
    });
    return true;
  }

  await registration.showNotification("ERCS Desktop Alert", {
    body: "Desktop notifications are enabled and ready for broadcast alerts!",
    icon: "/logo.png",
    badge: "/logo.png",
    data: { url: "/dashboard" },
  });

  return true;
}
