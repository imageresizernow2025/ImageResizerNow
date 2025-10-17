'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageTracker } from '@/lib/page-tracking';
import { trackPageView, trackToolUsage } from '@/lib/ga4-tracking';

export function PageTrackerComponent() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize page tracker with user ID (or null for guests)
    PageTracker.init(user?.id);

    // Track page view for both registered and guest users
    const trackPageViewData = async () => {
      await PageTracker.trackPageView(pathname);
      
      // Also track in GA4
      const userType = user ? 'registered' : 'anonymous';
      const pageTitle = getPageTitle(pathname);
      const toolUsed = getToolFromPath(pathname);
      
      trackPageView(pageTitle, userType, toolUsed);
      
      // Track tool usage if it's a specific tool page
      if (toolUsed && toolUsed !== 'main_page') {
        trackToolUsage(toolUsed, userType);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackPageViewData, 1000);

    return () => clearTimeout(timeoutId);
  }, [pathname, user?.id]);

  return null; // This component doesn't render anything
}

// Helper function to get page title from pathname
function getPageTitle(pathname: string): string {
  const pathMap: Record<string, string> = {
    '/': 'ImageResizerNow - Free Online Image Resizer',
    '/bulk-resize': 'Bulk Image Resizer - Resize Multiple Images at Once',
    '/image-compressor': 'Image Compressor - Reduce Image File Size',
    '/image-converter': 'Image Converter - Convert Between Image Formats',
    '/crop-image': 'Crop Image Tool - Crop and Resize Images',
    '/instagram-resizer': 'Instagram Resizer - Perfect Sizes for Instagram',
    '/facebook-resizer': 'Facebook Resizer - Facebook Post and Cover Photo Sizes',
    '/twitter-resizer': 'Twitter Resizer - Twitter Header and Post Sizes',
    '/youtube-resizer': 'YouTube Thumbnail Resizer - YouTube Video Thumbnails',
    '/shopify-resizer': 'Shopify Resizer - E-commerce Product Image Sizes',
    '/login': 'Login - ImageResizerNow',
    '/signup': 'Sign Up - Create Free Account',
    '/storage': 'Cloud Storage - Manage Your Images',
    '/privacy': 'Privacy Policy - ImageResizerNow',
    '/terms': 'Terms of Service - ImageResizerNow'
  };
  
  return pathMap[pathname] || 'ImageResizerNow';
}

// Helper function to get tool name from pathname
function getToolFromPath(pathname: string): string {
  const toolMap: Record<string, string> = {
    '/': 'main_page',
    '/bulk-resize': 'bulk_resizer',
    '/image-compressor': 'image_compressor',
    '/image-converter': 'image_converter',
    '/crop-image': 'crop_tool',
    '/instagram-resizer': 'instagram_resizer',
    '/facebook-resizer': 'facebook_resizer',
    '/twitter-resizer': 'twitter_resizer',
    '/youtube-resizer': 'youtube_resizer',
    '/shopify-resizer': 'shopify_resizer',
    '/storage': 'cloud_storage',
    '/login': 'auth_page',
    '/signup': 'auth_page',
    '/privacy': 'legal_page',
    '/terms': 'legal_page'
  };
  
  return toolMap[pathname] || 'main_page';
}
