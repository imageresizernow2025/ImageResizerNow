'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AD_CONFIG, shouldShowAds, getAdUnitId, isTestMode } from '@/lib/ad-config';

interface NativeAdProps {
  className?: string;
  userType?: 'registered' | 'anonymous';
  title?: string;
  description?: string;
  ctaText?: string;
}

export function NativeAd({ 
  className,
  userType = 'registered',
  title = "Recommended Tool",
  description = "Discover more image editing tools to enhance your workflow",
  ctaText = "Learn More"
}: NativeAdProps) {
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
    }, 1000);

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('native-ad');
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
        id="native-ad"
        className={cn(
          "w-full h-24 bg-muted/30 rounded-lg animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <div 
      id="native-ad"
      className={cn(
        "w-full my-4",
        className
      )}
    >
      {/* Google AdSense Native Ad */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CONFIG.googleAdSense.clientId}
        data-ad-slot={getAdUnitId('nativeAd')}
        data-ad-format="fluid"
        data-layout-key="-6t+ed+2i-1n-4w"
      />
      
      {/* Fallback content for test mode or when AdSense fails */}
      {(isTestMode() || !adLoaded) && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="text-xs">
                {isTestMode() ? 'Test Mode' : 'Sponsored'}
              </Badge>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 text-sm mb-1">
                {isTestMode() ? 'Native Ad Test' : title}
              </h4>
              <p className="text-orange-700 text-xs mb-2">
                {isTestMode() ? 'This is a test native ad. Replace with your AdSense native ad unit.' : description}
              </p>
              <button className="text-orange-600 hover:text-orange-800 text-xs font-medium underline">
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
