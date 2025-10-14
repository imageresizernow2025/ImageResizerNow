// Ad Loading Utility
// Provides robust ad loading with error handling and fallbacks

import { AD_CONFIG } from './ad-config';

interface AdLoadOptions {
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export class AdLoader {
  private static instance: AdLoader;
  private scriptLoaded = false;
  private scriptLoading = false;
  private loadPromises: Promise<void>[] = [];

  static getInstance(): AdLoader {
    if (!AdLoader.instance) {
      AdLoader.instance = new AdLoader();
    }
    return AdLoader.instance;
  }

  async loadAdSenseScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoading) {
      return new Promise((resolve, reject) => {
        this.loadPromises.push(Promise.resolve().then(() => resolve()));
      });
    }

    this.scriptLoading = true;

    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="adsbygoogle"]');
      if (existingScript) {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.googleAdSense.clientId}`;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', AD_CONFIG.googleAdSense.clientId);
      
      script.onload = () => {
        console.log('AdSense script loaded successfully');
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('AdSense script failed to load:', error);
        this.scriptLoading = false;
        reject(new Error('AdSense script failed to load'));
      };

      document.head.appendChild(script);
    });
  }

  async loadAd(
    adElement: HTMLElement,
    options: AdLoadOptions = {}
  ): Promise<void> {
    const {
      retryCount = 3,
      retryDelay = 1000,
      onSuccess,
      onError
    } = options;

    try {
      // Ensure AdSense script is loaded
      await this.loadAdSenseScript();

      // Wait for AdSense to be available
      await this.waitForAdSense();

      // Load the ad
      this.pushAd(adElement);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to load ad:', error);
      if (onError) onError(error as Error);
      
      // Retry if retryCount > 0
      if (retryCount > 0) {
        console.log(`Retrying ad load in ${retryDelay}ms... (${retryCount} attempts left)`);
        setTimeout(() => {
          this.loadAd(adElement, {
            ...options,
            retryCount: retryCount - 1,
            retryDelay: retryDelay * 1.5 // Exponential backoff
          });
        }, retryDelay);
      }
    }
  }

  private async waitForAdSense(): Promise<void> {
    return new Promise((resolve, reject) => {
      const maxWait = 10000; // 10 seconds
      const checkInterval = 100;
      let elapsed = 0;

      const checkAdSense = () => {
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          resolve();
          return;
        }

        elapsed += checkInterval;
        if (elapsed >= maxWait) {
          reject(new Error('AdSense not available after timeout'));
          return;
        }

        setTimeout(checkAdSense, checkInterval);
      };

      checkAdSense();
    });
  }

  private pushAd(adElement: HTMLElement): void {
    try {
      if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('Ad pushed to AdSense queue');
      } else {
        throw new Error('AdSense not available');
      }
    } catch (error) {
      console.error('Error pushing ad to AdSense:', error);
      throw error;
    }
  }

  // Utility method to check if ads should be loaded
  shouldLoadAds(userType: 'registered' | 'anonymous' = 'anonymous'): boolean {
    if (!AD_CONFIG.googleAdSense.enabled) return false;
    if (AD_CONFIG.googleAdSense.testMode) return true;
    
    if (userType === 'registered' && !AD_CONFIG.displayRules.showForRegisteredUsers) {
      return false;
    }
    
    if (userType === 'anonymous' && !AD_CONFIG.displayRules.showForAnonymousUsers) {
      return false;
    }
    
    return true;
  }

  // Utility method to get ad unit ID with fallback
  getAdUnitId(adType: keyof typeof AD_CONFIG.adUnits): string {
    const adUnitId = AD_CONFIG.adUnits[adType];
    if (!adUnitId || adUnitId === 'xxxxxxxxxx' || adUnitId === '') {
      console.warn(`Ad unit ID not configured for ${adType}, ads will be disabled`);
      return ''; // Return empty string to disable ads
    }
    return adUnitId;
  }
}

// Export singleton instance
export const adLoader = AdLoader.getInstance();
