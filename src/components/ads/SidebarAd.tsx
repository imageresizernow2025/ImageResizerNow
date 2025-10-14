'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AD_CONFIG, shouldShowAds, getAdUnitId, isTestMode } from '@/lib/ad-config';
import { adLoader } from '@/lib/ad-loader';

interface SidebarAdProps {
  className?: string;
  userType?: 'registered' | 'anonymous';
}

export function SidebarAd({ 
  className,
  userType = 'anonymous'
}: SidebarAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if ads should be shown
    if (!shouldShowAds(userType)) {
      return;
    }

    // Only load on desktop
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    // Lazy load after main content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('sidebar-ad');
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

  // Load Google AdSense ad
  useEffect(() => {
    if (!isLoaded || !isVisible || adLoaded || adError) return;

    const loadAd = async () => {
      try {
        if (!adRef.current) return;

        await adLoader.loadAd(adRef.current, {
          retryCount: 2,
          retryDelay: 1000,
          onSuccess: () => {
            setAdLoaded(true);
            console.log('Sidebar ad loaded successfully');
          },
          onError: (error) => {
            setAdError(error.message);
            console.error('Sidebar ad failed to load:', error);
          }
        });
      } catch (error) {
        setAdError(error instanceof Error ? error.message : 'Unknown error');
        console.error('Sidebar ad loading failed:', error);
      }
    };

    loadAd();
  }, [isLoaded, isVisible, adLoaded, adError]);

  // Don't render if ads shouldn't be shown or ad unit ID is not configured
  if (!shouldShowAds(userType) || !adLoader.getAdUnitId('sidebarAd')) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div 
        id="sidebar-ad"
        className={cn(
          "w-full h-64 bg-muted/30 rounded-lg animate-pulse hidden lg:block",
          className
        )}
      />
    );
  }

  return (
    <div 
      id="sidebar-ad"
      className={cn(
        "w-full hidden lg:block",
        className
      )}
    >
      {adError ? (
        <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
          Ad unavailable
        </div>
      ) : (
        <div ref={adRef}>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={AD_CONFIG.googleAdSense.clientId}
            data-ad-slot={adLoader.getAdUnitId('sidebarAd')}
            data-ad-format="rectangle"
            data-full-width-responsive="false"
            data-adtest={AD_CONFIG.googleAdSense.testMode ? 'on' : 'off'}
          />
        </div>
      )}
      {isTestMode() && (
        <div className="text-xs text-center text-muted-foreground mt-2">
          Test Mode - Sidebar Ad (300x250) - Desktop Only
        </div>
      )}
    </div>
  );
}
