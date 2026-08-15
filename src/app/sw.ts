/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that replaces `self.__SW_MANIFEST`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Push Notification Handler for Desktop Web & PWA
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let title = "ERCS Alert";
  let body = "You have a new update from Ethiopian Red Cross Society.";
  let url = "/dashboard";
  let icon = "/logo.png";

  try {
    const data = event.data.json();
    if (data.notification) {
      title = data.notification.title || title;
      body = data.notification.body || body;
      icon = data.notification.icon || icon;
    } else if (data.title || data.body) {
      title = data.title || title;
      body = data.body || body;
      icon = data.icon || icon;
    }
    if (data.fcmOptions?.link) {
      url = data.fcmOptions.link;
    } else if (data.data?.url) {
      url = data.data.url;
    } else if (data.link) {
      url = data.link;
    }
  } catch {
    const text = event.data.text();
    if (text) {
      body = text;
    }
  }

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    badge: icon,
    tag: "ercs-broadcast",
    data: { url: url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click Handler to bring desktop app / browser tab to focus
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client && client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
