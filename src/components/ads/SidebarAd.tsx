'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AD_CONFIG, shouldShowAds, getAdUnitId, isTestMode } from '@/lib/ad-config';

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
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CONFIG.googleAdSense.clientId}
        data-ad-slot={getAdUnitId('sidebarAd')}
        data-ad-format="rectangle"
        data-full-width-responsive="false"
      />
      {isTestMode() && (
        <div className="text-xs text-center text-muted-foreground mt-2">
          Test Mode - Sidebar Ad (300x250) - Desktop Only
        </div>
      )}
    </div>
  );
}
