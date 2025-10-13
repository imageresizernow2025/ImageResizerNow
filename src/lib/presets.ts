
// Basic presets available to FREE users
export const basicPresets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1600, height: 900 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
];

export const socialPresets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Instagram Reels', width: 1080, height: 1920 },
    { name: 'Instagram Feed', width: 1080, height: 1080 },
    { name: 'Instagram Profile', width: 320, height: 320 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Facebook Cover', width: 1200, height: 315 },
    { name: 'Facebook Event', width: 1920, height: 1080 },
    { name: 'Facebook Ad', width: 1200, height: 628 },
    { name: 'Twitter Post', width: 1600, height: 900 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'Pinterest Pin', width: 1000, height: 1500 },
    { name: 'Pinterest Board', width: 222, height: 150 },
    { name: 'TikTok Video', width: 1080, height: 1920 },
    { name: 'TikTok Thumbnail', width: 1080, height: 1920 },
];
  
export const webPresets = [
    { name: 'Web Banner', width: 1920, height: 600 },
    { name: 'Blog Image', width: 1200, height: 800 },
    { name: 'Thumbnail', width: 400, height: 400 },
    { name: 'Favicon', width: 32, height: 32 },
    { name: 'Amazon Product (Main)', width: 1000, height: 1000 },
    { name: 'Amazon Product (Gallery)', width: 1000, height: 1000 },
    { name: 'Amazon Product (Thumbnail)', width: 75, height: 75 },
    { name: 'Amazon Product (Zoom)', width: 2000, height: 2000 },
];

export const printPresets = [
    { name: 'A4 (300 DPI)', width: 2480, height: 3508 },
    { name: 'A5 (300 DPI)', width: 1748, height: 2480 },
    { name: 'Postcard (4x6 in)', width: 1200, height: 1800 },
];

export const shopifyPresets = [
    // Product Images
    { name: 'Shopify Product (Ideal)', width: 2048, height: 2048, description: 'High-res for zoom feature' },
    { name: 'Shopify Product (Min Zoom)', width: 800, height: 800, description: 'Minimum for zoom functionality' },
    
    // Collection Images
    { name: 'Shopify Collection', width: 1024, height: 1024, description: '1:1 aspect ratio for grid layout' },
    
    // Slideshow/Hero Images
    { name: 'Shopify Slideshow (Desktop)', width: 1920, height: 1080, description: '16:9 aspect ratio for banners' },
    { name: 'Shopify Hero Mobile', width: 1080, height: 1920, description: 'Mobile-optimized hero image' },
    
    // Logo
    { name: 'Shopify Logo (Square)', width: 200, height: 200, description: 'Square logo for versatility' },
    { name: 'Shopify Logo (Rectangular)', width: 400, height: 100, description: 'Rectangular logo format' },
];
