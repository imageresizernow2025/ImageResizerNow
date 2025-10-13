// Ad Configuration
// Update these values when you get approved by Google AdSense

export const AD_CONFIG = {
  // Google AdSense Configuration
  googleAdSense: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-1125405879614984',
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' || true,
    testMode: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_AD_TEST_MODE === 'true',
  },
  
  // Ad Unit IDs (replace with your actual ad unit IDs from Google AdSense)
  adUnits: {
    // Banner Ads
    topBannerMobile: 'xxxxxxxxxx', // 320x50 mobile banner
    topBannerDesktop: 'xxxxxxxxxx', // 728x90 desktop banner
    bottomBannerMobile: 'xxxxxxxxxx', // 320x50 mobile banner
    bottomBannerDesktop: 'xxxxxxxxxx', // 728x90 desktop banner
    
    // Rectangle Ads
    sidebarAd: 'xxxxxxxxxx', // 300x250 rectangle
    betweenToolsMobile: 'xxxxxxxxxx', // 300x250 mobile rectangle
    betweenToolsDesktop: 'xxxxxxxxxx', // 728x90 desktop banner
    
    // Modal Ads
    modalTop: 'xxxxxxxxxx', // 320x50 modal top banner
    modalMiddle: 'xxxxxxxxxx', // 300x250 modal rectangle
    modalBottom: 'xxxxxxxxxx', // 320x50 modal bottom banner
    
    // Native Ads
    nativeAd: 'xxxxxxxxxx', // Native ad unit
  },
  
  // Ad Sizes
  sizes: {
    topBanner: {
      mobile: '320x50',
      desktop: '728x90',
    },
    bottomBanner: {
      mobile: '320x50',
      desktop: '728x90',
    },
    sidebar: '300x250',
    betweenTools: {
      mobile: '300x250',
      desktop: '728x90',
    },
    native: 'fluid',
  },
  
  // Display Rules
  displayRules: {
    maxAdsPerPage: {
      mobile: 2,
      desktop: 3,
    },
    showForRegisteredUsers: false, // Set to true to show ads for registered users
    showForAnonymousUsers: true,
  }
};

// Helper function to check if ads should be displayed
export const shouldShowAds = (userType: 'registered' | 'anonymous' = 'anonymous'): boolean => {
  if (!AD_CONFIG.googleAdSense.enabled) return false;
  if (AD_CONFIG.googleAdSense.testMode) return true;
  
  if (userType === 'registered' && !AD_CONFIG.displayRules.showForRegisteredUsers) {
    return false;
  }
  
  if (userType === 'anonymous' && !AD_CONFIG.displayRules.showForAnonymousUsers) {
    return false;
  }
  
  return true;
};

// Helper function to get ad unit ID
export const getAdUnitId = (adType: keyof typeof AD_CONFIG.adUnits): string => {
  return AD_CONFIG.adUnits[adType];
};

// Helper function to check if in test mode
export const isTestMode = (): boolean => {
  return AD_CONFIG.googleAdSense.testMode;
};
