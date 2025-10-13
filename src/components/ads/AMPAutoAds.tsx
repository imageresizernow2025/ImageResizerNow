'use client';

import React, { useEffect } from 'react';

interface AMPAutoAdsProps {
  className?: string;
}

export function AMPAutoAds({ className }: AMPAutoAdsProps) {
  useEffect(() => {
    // Ensure AMP auto ads script is loaded
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="amp-auto-ads"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('custom-element', 'amp-auto-ads');
      script.src = 'https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <amp-auto-ads 
      type="adsense"
      data-ad-client="ca-pub-1125405879614984"
      className={className}
    />
  );
}

// Alternative implementation for non-AMP pages
export function GoogleAutoAds() {
  useEffect(() => {
    // Load Google AdSense auto ads for non-AMP pages
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1125405879614984';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return null; // This component doesn't render anything visible
}
