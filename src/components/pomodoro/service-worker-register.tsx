'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'activated' &&
                navigator.serviceWorker.controller
              ) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        console.log('Service Worker registered successfully:', registration.scope);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    // Register after page load to avoid blocking rendering
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  const handleUpdate = () => {
    setUpdateAvailable(false);
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleUpdate}
        className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Update available, click to refresh"
      >
        🔄 Update Available — Click to Refresh
      </button>
    </div>
  );
}
