// Page tracking utility for analytics
export class PageTracker {
  private static sessionId: string | null = null;
  private static userId: number | null = null;
  private static guestId: string | null = null;

  // Initialize tracking with user ID or guest ID
  static init(userId?: number) {
    this.userId = userId || null;
    this.sessionId = this.generateSessionId();
    
    // Generate guest ID for anonymous users
    if (!userId) {
      this.guestId = this.getOrCreateGuestId();
    }
  }

  // Generate a unique session ID
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create guest ID for anonymous users
  private static getOrCreateGuestId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  }

  // Track page visit
  static async trackPage(
    pagePath: string, 
    pageTitle?: string, 
    referrer?: string
  ) {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') {
        console.warn('Page tracking skipped - not in browser environment');
        return;
      }

      const trackingData = {
        user_id: this.userId,
        guest_id: this.guestId,
        page_path: pagePath,
        page_title: pageTitle || document.title,
        session_id: this.sessionId,
        referrer: referrer || document.referrer,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Send to API
      await fetch('/api/track-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData)
      });
    } catch (error) {
      console.error('Error tracking page:', error);
    }
  }

  // Track page with automatic referrer detection
  static async trackPageView(pagePath: string, pageTitle?: string) {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('Page tracking skipped - not in browser environment');
      return;
    }
    
    const referrer = document.referrer || window.location.href;
    await this.trackPage(pagePath, pageTitle, referrer);
  }
}

// Hook for React components
export function usePageTracking() {
  const trackPage = (pagePath: string, pageTitle?: string) => {
    PageTracker.trackPageView(pagePath, pageTitle);
  };

  return { trackPage };
}
