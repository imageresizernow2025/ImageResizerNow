'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    googlefc: {
      loaded: () => void;
      showConsentBanner: () => void;
      hideConsentBanner: () => void;
      showConsentModal: () => void;
      hideConsentModal: () => void;
      getConsentStatus: () => Promise<{
        ad_storage: 'granted' | 'denied';
        analytics_storage: 'granted' | 'denied';
        functionality_storage: 'granted' | 'denied';
        personalization_storage: 'granted' | 'denied';
        security_storage: 'granted' | 'denied';
      }>;
      setConsentStatus: (consent: {
        ad_storage?: 'granted' | 'denied';
        analytics_storage?: 'granted' | 'denied';
        functionality_storage?: 'granted' | 'denied';
        personalization_storage?: 'granted' | 'denied';
        security_storage?: 'granted' | 'denied';
      }) => void;
    };
  }
}

export function GoogleCMP() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [consentStatus, setConsentStatus] = useState<any>(null);

  useEffect(() => {
    // Wait for Google CMP to load
    const checkGoogleFC = () => {
      if (window.googlefc) {
        setIsLoaded(true);
        console.log('Google CMP loaded successfully');
        
        // Get current consent status
        window.googlefc.getConsentStatus().then((status) => {
          setConsentStatus(status);
          console.log('Current consent status:', status);
        });
      } else {
        setTimeout(checkGoogleFC, 100);
      }
    };

    checkGoogleFC();
  }, []);

  const showConsentBanner = () => {
    if (window.googlefc) {
      window.googlefc.showConsentBanner();
    }
  };

  const showConsentModal = () => {
    if (window.googlefc) {
      window.googlefc.showConsentModal();
    }
  };

  const hideConsentBanner = () => {
    if (window.googlefc) {
      window.googlefc.hideConsentBanner();
    }
  };

  const hideConsentModal = () => {
    if (window.googlefc) {
      window.googlefc.hideConsentModal();
    }
  };

  const setConsent = (consent: any) => {
    if (window.googlefc) {
      window.googlefc.setConsentStatus(consent);
      setConsentStatus(consent);
    }
  };

  // This component doesn't render anything visible
  // It just manages the Google CMP integration
  return null;
}

// Hook to use Google CMP functionality
export function useGoogleCMP() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [consentStatus, setConsentStatus] = useState<any>(null);

  useEffect(() => {
    const checkGoogleFC = () => {
      if (window.googlefc) {
        setIsLoaded(true);
        window.googlefc.getConsentStatus().then((status) => {
          setConsentStatus(status);
        });
      } else {
        setTimeout(checkGoogleFC, 100);
      }
    };

    checkGoogleFC();
  }, []);

  const showConsentBanner = () => {
    if (window.googlefc) {
      window.googlefc.showConsentBanner();
    }
  };

  const showConsentModal = () => {
    if (window.googlefc) {
      window.googlefc.showConsentModal();
    }
  };

  const hideConsentBanner = () => {
    if (window.googlefc) {
      window.googlefc.hideConsentBanner();
    }
  };

  const hideConsentModal = () => {
    if (window.googlefc) {
      window.googlefc.hideConsentModal();
    }
  };

  const setConsent = (consent: any) => {
    if (window.googlefc) {
      window.googlefc.setConsentStatus(consent);
      setConsentStatus(consent);
    }
  };

  return {
    isLoaded,
    consentStatus,
    showConsentBanner,
    showConsentModal,
    hideConsentBanner,
    hideConsentModal,
    setConsent,
  };
}
