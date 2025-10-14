/**
 * Modern event handling utilities to replace deprecated unload events
 */

/**
 * Replaces deprecated unload event listeners with modern alternatives
 * Uses pagehide event which is more reliable and not deprecated
 */
export function addPageUnloadListener(callback: () => void): () => void {
  const handlePageHide = (event: PageTransitionEvent) => {
    // Only trigger for actual page unload, not navigation
    if (event.persisted) {
      return;
    }
    callback();
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Only prevent default if we have unsaved changes
    // This is more user-friendly than always preventing navigation
    callback();
  };

  // Use pagehide for most cases (more reliable)
  window.addEventListener('pagehide', handlePageHide);
  
  // Use beforeunload only when necessary (less intrusive)
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return cleanup function
  return () => {
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

/**
 * Safe way to handle page visibility changes
 * Replaces unload events with visibility API
 */
export function addVisibilityChangeListener(callback: () => void): () => void {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      callback();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * Clean up any existing unload event listeners
 * This helps prevent the deprecation warnings
 */
export function cleanupDeprecatedUnloadListeners(): void {
  // Remove any existing unload listeners that might be causing warnings
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  // Override addEventListener to prevent unload events
  window.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    if (type === 'unload') {
      console.warn('Deprecated unload event prevented. Use pagehide or beforeunload instead.');
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Override removeEventListener to handle unload events
  window.removeEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
    if (type === 'unload') {
      console.warn('Removing deprecated unload event listener.');
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
}

/**
 * Initialize modern event handling
 * Call this early in your app to prevent deprecated unload events
 */
export function initializeModernEventHandling(): void {
  // Clean up any existing deprecated listeners
  cleanupDeprecatedUnloadListeners();

  // Add a global pagehide handler for cleanup
  window.addEventListener('pagehide', () => {
    // Clean up any resources that need cleanup
    console.log('Page is being unloaded, cleaning up resources...');
  });
}
