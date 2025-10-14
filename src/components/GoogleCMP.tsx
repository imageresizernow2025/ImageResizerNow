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
      callbackQueue: Array<{
        CONSENT_DATA_READY?: () => void;
      }>;
      controlledMessagingFunction?: () => void;
    };
  }
}

export function GoogleCMP() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [consentStatus, setConsentStatus] = useState<any>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    const maxAttempts = 50; // Maximum attempts over 5 seconds

    const initializeGoogleCMP = () => {
      try {
        // Ensure window.googlefc exists
        if (typeof window !== 'undefined') {
          window.googlefc = window.googlefc || {};
          window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
        }
      } catch (error) {
        console.error('Error initializing Google CMP:', error);
      }
    };

    const checkGoogleFC = () => {
      try {
        if (window.googlefc && typeof window.googlefc.getConsentStatus === 'function') {
          setIsLoaded(true);
          console.log('Google CMP loaded successfully');
          
          // Get current consent status
          window.googlefc.getConsentStatus().then((status) => {
            setConsentStatus(status);
            console.log('Current consent status:', status);
          }).catch((error) => {
            console.error('Error getting consent status:', error);
          });
          
          // Clear intervals
          if (intervalId) clearInterval(intervalId);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking Google CMP:', error);
        return false;
      }
    };

    const attemptInitialization = () => {
      setInitializationAttempts(prev => prev + 1);
      
      if (checkGoogleFC()) {
        return;
      }
      
      if (initializationAttempts >= maxAttempts) {
        console.warn('Google CMP failed to load after maximum attempts');
        return;
      }
      
      // Try again after a short delay
      timeoutId = setTimeout(attemptInitialization, 100);
    };

    // Initialize Google CMP immediately
    initializeGoogleCMP();

    // Add callback to queue for when consent data is ready
    try {
      if (window.googlefc && window.googlefc.callbackQueue) {
        window.googlefc.callbackQueue.push({
          'CONSENT_DATA_READY': function () {
            try {
              if (window.googlefc && typeof window.googlefc.getConsentStatus === 'function') {
                setIsLoaded(true);
                console.log('Google CMP loaded via callback queue');
                
                window.googlefc.getConsentStatus().then((status) => {
                  setConsentStatus(status);
                  console.log('Current consent status:', status);
                }).catch((error) => {
                  console.error('Error getting consent status:', error);
                });
              }
            } catch (error) {
              console.error('Error in CONSENT_DATA_READY callback:', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error setting up callback queue:', error);
    }

    // Start fallback polling
    timeoutId = setTimeout(attemptInitialization, 500);

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [initializationAttempts]);

  const showConsentBanner = () => {
    try {
      if (window.googlefc && typeof window.googlefc.showConsentBanner === 'function') {
        window.googlefc.showConsentBanner();
      }
    } catch (error) {
      console.error('Error showing consent banner:', error);
    }
  };

  const showConsentModal = () => {
    try {
      if (window.googlefc && typeof window.googlefc.showConsentModal === 'function') {
        window.googlefc.showConsentModal();
      }
    } catch (error) {
      console.error('Error showing consent modal:', error);
    }
  };

  const hideConsentBanner = () => {
    try {
      if (window.googlefc && typeof window.googlefc.hideConsentBanner === 'function') {
        window.googlefc.hideConsentBanner();
      }
    } catch (error) {
      console.error('Error hiding consent banner:', error);
    }
  };

  const hideConsentModal = () => {
    try {
      if (window.googlefc && typeof window.googlefc.hideConsentModal === 'function') {
        window.googlefc.hideConsentModal();
      }
    } catch (error) {
      console.error('Error hiding consent modal:', error);
    }
  };

  const setConsent = (consent: any) => {
    try {
      if (window.googlefc && typeof window.googlefc.setConsentStatus === 'function') {
        window.googlefc.setConsentStatus(consent);
        setConsentStatus(consent);
      }
    } catch (error) {
      console.error('Error setting consent status:', error);
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
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    const maxAttempts = 50; // Maximum attempts over 5 seconds

    const initializeGoogleCMP = () => {
      try {
        // Ensure window.googlefc exists
        if (typeof window !== 'undefined') {
          window.googlefc = window.googlefc || {};
          window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
        }
      } catch (error) {
        console.error('Error initializing Google CMP:', error);
      }
    };

    const checkGoogleFC = () => {
      try {
        if (window.googlefc && typeof window.googlefc.getConsentStatus === 'function') {
          setIsLoaded(true);
          console.log('Google CMP loaded successfully (hook)');
          
          // Get current consent status
          window.googlefc.getConsentStatus().then((status) => {
            setConsentStatus(status);
            console.log('Current consent status (hook):', status);
          }).catch((error) => {
            console.error('Error getting consent status (hook):', error);
          });
          
          // Clear intervals
          if (intervalId) clearInterval(intervalId);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking Google CMP (hook):', error);
        return false;
      }
    };

    const attemptInitialization = () => {
      setInitializationAttempts(prev => prev + 1);
      
      if (checkGoogleFC()) {
        return;
      }
      
      if (initializationAttempts >= maxAttempts) {
        console.warn('Google CMP failed to load after maximum attempts (hook)');
        return;
      }
      
      // Try again after a short delay
      timeoutId = setTimeout(attemptInitialization, 100);
    };

    // Initialize Google CMP immediately
    initializeGoogleCMP();

    // Add callback to queue for when consent data is ready
    try {
      if (window.googlefc && window.googlefc.callbackQueue) {
        window.googlefc.callbackQueue.push({
          'CONSENT_DATA_READY': function () {
            try {
              if (window.googlefc && typeof window.googlefc.getConsentStatus === 'function') {
                setIsLoaded(true);
                console.log('Google CMP loaded via callback queue (hook)');
                
                window.googlefc.getConsentStatus().then((status) => {
                  setConsentStatus(status);
                  console.log('Current consent status (hook):', status);
                }).catch((error) => {
                  console.error('Error getting consent status (hook):', error);
                });
              }
            } catch (error) {
              console.error('Error in CONSENT_DATA_READY callback (hook):', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error setting up callback queue (hook):', error);
    }

    // Start fallback polling
    timeoutId = setTimeout(attemptInitialization, 500);

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [initializationAttempts]);

  const showConsentBanner = () => {
    try {
      if (window.googlefc && typeof window.googlefc.showConsentBanner === 'function') {
        window.googlefc.showConsentBanner();
      }
    } catch (error) {
      console.error('Error showing consent banner:', error);
    }
  };

  const showConsentModal = () => {
    try {
      if (window.googlefc && typeof window.googlefc.showConsentModal === 'function') {
        window.googlefc.showConsentModal();
      }
    } catch (error) {
      console.error('Error showing consent modal:', error);
    }
  };

  const hideConsentBanner = () => {
    try {
      if (window.googlefc && typeof window.googlefc.hideConsentBanner === 'function') {
        window.googlefc.hideConsentBanner();
      }
    } catch (error) {
      console.error('Error hiding consent banner:', error);
    }
  };

  const hideConsentModal = () => {
    try {
      if (window.googlefc && typeof window.googlefc.hideConsentModal === 'function') {
        window.googlefc.hideConsentModal();
      }
    } catch (error) {
      console.error('Error hiding consent modal:', error);
    }
  };

  const setConsent = (consent: any) => {
    try {
      if (window.googlefc && typeof window.googlefc.setConsentStatus === 'function') {
        window.googlefc.setConsentStatus(consent);
        setConsentStatus(consent);
      }
    } catch (error) {
      console.error('Error setting consent status:', error);
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
