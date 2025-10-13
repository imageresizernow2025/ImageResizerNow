'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AD_CONFIG, shouldShowAds, getAdUnitId, isTestMode } from '@/lib/ad-config';

interface ModalAdProps {
  className?: string;
  userType?: 'registered' | 'anonymous';
  position?: 'top' | 'middle' | 'bottom';
}

export function ModalAd({ 
  className,
  userType = 'anonymous',
  position = 'middle'
}: ModalAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Check if ads should be shown
    if (!shouldShowAds(userType)) {
      return;
    }

    // Lazy load with shorter delay for modal context
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`modal-ad-${position}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(timer);
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [userType, position]);

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
        id={`modal-ad-${position}`}
        className={cn(
          "w-full h-16 bg-muted/30 rounded-lg animate-pulse",
          className
        )}
      />
    );
  }

  // Different ad sizes based on position
  const getAdSize = () => {
    switch (position) {
      case 'top':
        return '320x50'; // Mobile banner for top
      case 'middle':
        return '300x250'; // Rectangle for middle
      case 'bottom':
        return '320x50'; // Mobile banner for bottom
      default:
        return '300x250';
    }
  };

  return (
    <div 
      id={`modal-ad-${position}`}
      className={cn(
        "w-full flex justify-center items-center",
        className
      )}
    >
      <div className="w-full max-w-sm">
        {/* Mobile Banner for top/bottom positions */}
        {(position === 'top' || position === 'bottom') && (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={AD_CONFIG.googleAdSense.clientId}
            data-ad-slot={getAdUnitId(position === 'top' ? 'modalTop' : 'modalBottom')}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
        
        {/* Rectangle for middle position */}
        {position === 'middle' && (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={AD_CONFIG.googleAdSense.clientId}
            data-ad-slot={getAdUnitId('modalMiddle')}
            data-ad-format="rectangle"
            data-full-width-responsive="false"
          />
        )}
        
        {isTestMode() && (
          <div className="text-xs text-center text-muted-foreground mt-1">
            Test Mode - Modal Ad ({getAdSize()}) - {position}
          </div>
        )}
      </div>
    </div>
  );
}
