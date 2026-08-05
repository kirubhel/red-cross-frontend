"use client";

import { useEffect } from 'react';
import { syncOfflineRequests } from '@/lib/offlineSync';

export function OfflineSyncListener() {
  useEffect(() => {
    function handleOnline() {
      syncOfflineRequests();
    }

    window.addEventListener('online', handleOnline);
    
    // Attempt sync on mount if online
    if (navigator.onLine) {
      syncOfflineRequests();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}
