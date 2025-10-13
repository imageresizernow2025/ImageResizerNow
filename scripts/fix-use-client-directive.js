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

// Function to fix 'use client' directive placement
function fixUseClientDirective(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already fixed
    if (content.startsWith("'use client';")) {
      console.log(`✅ ${filePath} already fixed`);
      return;
    }
    
    // Remove existing 'use client' directive
    content = content.replace(/'use client';\s*\n?/g, '');
    
    // Add 'use client' at the very beginning
    content = "'use client';\n\n" + content;
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all tool pages
console.log('🚀 Fixing use client directive placement...\n');

toolPages.forEach(fixUseClientDirective);

console.log('\n✨ All use client directive issues fixed!');
