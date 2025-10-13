'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageTracker } from '@/lib/page-tracking';

export function PageTrackerComponent() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize page tracker with user ID (or null for guests)
    PageTracker.init(user?.id);

    // Track page view for both registered and guest users
    const trackPageView = async () => {
      await PageTracker.trackPageView(pathname);
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackPageView, 1000);

    return () => clearTimeout(timeoutId);
  }, [pathname, user?.id]);

  return null; // This component doesn't render anything
}
