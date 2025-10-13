'use client';

import { useAuth } from '@/contexts/AuthContext';
import { TopBanner } from './TopBanner';
import { BottomBanner } from './BottomBanner';
import { SidebarAd } from './SidebarAd';
import { BetweenToolsAd } from './BetweenToolsAd';

interface AdWrapperProps {
  type: 'top' | 'bottom' | 'sidebar' | 'between-tools';
  className?: string;
}

export function AdWrapper({ type, className }: AdWrapperProps) {
  const { user } = useAuth();
  const userType = user ? 'registered' : 'anonymous';

  switch (type) {
    case 'top':
      return <TopBanner userType={userType} className={className} />;
    case 'bottom':
      return <BottomBanner userType={userType} className={className} />;
    case 'sidebar':
      return <SidebarAd userType={userType} className={className} />;
    case 'between-tools':
      return <BetweenToolsAd userType={userType} className={className} />;
    default:
      return null;
  }
}
