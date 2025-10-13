const fs = require('fs');
const path = require('path');

// List of tool pages to update
const toolPages = [
  'src/app/instagram-resizer/page.tsx',
  'src/app/bulk-resize/page.tsx',
  'src/app/image-compressor/page.tsx',
  'src/app/image-converter/page.tsx',
  'src/app/crop-image/page.tsx',
  'src/app/facebook-resizer/page.tsx',
  'src/app/twitter-resizer/page.tsx',
  'src/app/youtube-resizer/page.tsx',
  'src/app/shopify-resizer/page.tsx'
];

// Function to update a single file
function updateAdProps(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already updated
    if (content.includes('userType={userType}')) {
      console.log(`✅ ${filePath} already updated`);
      return;
    }
    
    // Add useAuth import if not present
    if (!content.includes("import { useAuth } from '@/contexts/AuthContext';")) {
      content = content.replace(
        /(import.*from.*;\s*)+/,
        '$1import { useAuth } from \'@/contexts/AuthContext\';\n'
      );
    }
    
    // Add 'use client' directive if not present
    if (!content.includes("'use client';")) {
      content = "'use client';\n\n" + content;
    }
    
    // Update the main function to be a client component
    content = content.replace(
      /export default function (\w+)\(\) \{/,
      'export default function $1() {\n  const { user } = useAuth();\n  const userType = user ? \'registered\' : \'anonymous\';'
    );
    
    // Update TopBanner
    content = content.replace(
      /<TopBanner \/>/g,
      '<TopBanner userType={userType} />'
    );
    
    // Update BottomBanner
    content = content.replace(
      /<BottomBanner \/>/g,
      '<BottomBanner userType={userType} />'
    );
    
    // Update SidebarAd
    content = content.replace(
      /<SidebarAd \/>/g,
      '<SidebarAd userType={userType} />'
    );
    
    // Update BetweenToolsAd
    content = content.replace(
      /<BetweenToolsAd \/>/g,
      '<BetweenToolsAd userType={userType} />'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all tool pages
console.log('🚀 Updating ad components with userType props...\n');

toolPages.forEach(updateAdProps);

console.log('\n✨ All ad components updated with userType props!');
