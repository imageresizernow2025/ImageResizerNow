const fs = require('fs');
const path = require('path');

// List of tool pages that need fixing
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

// Function to fix metadata export issue
function fixMetadataExport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already fixed
    if (!content.includes("'use client';") || !content.includes('export const metadata')) {
      console.log(`✅ ${filePath} already fixed or doesn't need fixing`);
      return;
    }
    
    // Move metadata export before 'use client' directive
    const metadataMatch = content.match(/export const metadata: Metadata = \{[\s\S]*?\};/);
    if (metadataMatch) {
      const metadata = metadataMatch[0];
      
      // Remove metadata from current position
      content = content.replace(metadata, '');
      
      // Add metadata before 'use client'
      content = content.replace("'use client';", metadata + "\n\n'use client';");
      
      // Clean up extra newlines
      content = content.replace(/\n\n\n+/g, '\n\n');
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all tool pages
console.log('🚀 Fixing metadata export issues...\n');

toolPages.forEach(fixMetadataExport);

console.log('\n✨ All metadata export issues fixed!');
