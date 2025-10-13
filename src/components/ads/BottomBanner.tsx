'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AD_CONFIG, shouldShowAds, getAdUnitId, isTestMode } from '@/lib/ad-config';

interface BottomBannerProps {
  className?: string;
  userType?: 'registered' | 'anonymous';
}

export function BottomBanner({ 
  className,
  userType = 'anonymous'
}: BottomBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Check if ads should be shown
    if (!shouldShowAds(userType)) {
      return;
    }

    // Lazy load after main content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('bottom-banner-ad');
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(timer);
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [userType]);

  // Load Google AdSense script
  useEffect(() => {
    if (!isLoaded || !isVisible || adLoaded) return;

    const loadAdSense = () => {
      if (window.adsbygoogle) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };

    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.googleAdSense.clientId}`;
      script.crossOrigin = 'anonymous';
      script.onload = loadAdSense;
      document.head.appendChild(script);
    } else {
      loadAdSense();
    }
  }, [isLoaded, isVisible, adLoaded]);

  // Don't render if ads shouldn't be shown
  if (!shouldShowAds(userType)) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div 
        id="bottom-banner-ad"
        className={cn(
          "w-full h-12 md:h-20 bg-muted/30 rounded-lg animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <div 
      id="bottom-banner-ad"
      className={cn(
        "w-full flex justify-center items-center mt-6 mb-4",
        className
      )}
    >
      <div className="w-full max-w-4xl">
        {/* Mobile Banner */}
        <div className="block md:hidden">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={AD_CONFIG.googleAdSense.clientId}
            data-ad-slot={getAdUnitId('bottomBannerMobile')}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          {isTestMode() && (
            <div className="text-xs text-center text-muted-foreground mt-1">
              Test Mode - Mobile Banner (320x50)
            </div>
          )}
        </div>
        
        {/* Desktop Banner */}
        <div className="hidden md:block">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={AD_CONFIG.googleAdSense.clientId}
            data-ad-slot={getAdUnitId('bottomBannerDesktop')}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          {isTestMode() && (
            <div className="text-xs text-center text-muted-foreground mt-1">
              Test Mode - Desktop Banner (728x90)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
