const fs = require('fs');
const path = require('path');

// List of tool pages to revert
const toolPages = [
  'src/app/bulk-resize/page.tsx',
  'src/app/crop-image/page.tsx',
  'src/app/facebook-resizer/page.tsx',
  'src/app/image-compressor/page.tsx',
  'src/app/image-converter/page.tsx',
  'src/app/instagram-resizer/page.tsx',
  'src/app/shopify-resizer/page.tsx',
  'src/app/twitter-resizer/page.tsx',
  'src/app/youtube-resizer/page.tsx'
];

// Function to revert to server components
function revertToServerComponent(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove 'use client' directive
    content = content.replace(/'use client';\s*\n?/g, '');
    
    // Remove useAuth import
    content = content.replace(/import { useAuth } from '@\/contexts\/AuthContext';\s*\n?/g, '');
    
    // Remove userType logic
    content = content.replace(/\s*const { user } = useAuth\(\);\s*\n\s*const userType = user \? 'registered' : 'anonymous';\s*\n?/g, '');
    
    // Replace ad components with AdWrapper
    content = content.replace(/import { TopBanner } from '@\/components\/ads\/TopBanner';/g, "import { AdWrapper } from '@/components/ads/AdWrapper';");
    content = content.replace(/import { BottomBanner } from '@\/components\/ads\/BottomBanner';/g, '');
    content = content.replace(/import { SidebarAd } from '@\/components\/ads\/SidebarAd';/g, '');
    content = content.replace(/import { BetweenToolsAd } from '@\/components\/ads\/BetweenToolsAd';/g, '');
    
    // Replace ad component usage
    content = content.replace(/<TopBanner userType={userType} \/>/g, '<AdWrapper type="top" />');
    content = content.replace(/<BottomBanner userType={userType} \/>/g, '<AdWrapper type="bottom" />');
    content = content.replace(/<SidebarAd userType={userType} \/>/g, '<AdWrapper type="sidebar" />');
    content = content.replace(/<BetweenToolsAd userType={userType} \/>/g, '<AdWrapper type="between-tools" />');
    
    // Clean up extra newlines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Reverted ${filePath}`);
  } catch (error) {
    console.error(`❌ Error reverting ${filePath}:`, error.message);
  }
}

// Revert all tool pages
console.log('🚀 Reverting tool pages to server components...\n');

toolPages.forEach(revertToServerComponent);

console.log('\n✨ All tool pages reverted to server components!');
