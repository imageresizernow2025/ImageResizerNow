const fs = require('fs');
const path = require('path');

// List of tool pages to update
const toolPages = [
  'src/app/image-compressor/page.tsx',
  'src/app/image-converter/page.tsx',
  'src/app/crop-image/page.tsx',
  'src/app/facebook-resizer/page.tsx',
  'src/app/twitter-resizer/page.tsx',
  'src/app/youtube-resizer/page.tsx',
  'src/app/shopify-resizer/page.tsx'
];

// Import statements to add
const importsToAdd = `import { TopBanner } from '@/components/ads/TopBanner';
import { BottomBanner } from '@/components/ads/BottomBanner';
import { SidebarAd } from '@/components/ads/SidebarAd';`;

// Function to update a single file
function updateToolPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already updated
    if (content.includes('TopBanner')) {
      console.log(`✅ ${filePath} already updated`);
      return;
    }
    
    // Add imports after existing imports
    const importRegex = /(import.*from.*;\s*)+/;
    const match = content.match(importRegex);
    if (match) {
      const lastImport = match[0].trim();
      content = content.replace(lastImport, lastImport + '\n' + importsToAdd);
    }
    
    // Add TopBanner after breadcrumb
    content = content.replace(
      /(<Breadcrumb[^>]*\/>\s*)/,
      '$1        <TopBanner />\n'
    );
    
    // Wrap ImageResizer with sidebar layout
    content = content.replace(
      /(\s*)(<ImageResizer \/>)/,
      `$1        {/* Desktop sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            $2
          </div>
          <div className="lg:w-80">
            <SidebarAd />
          </div>
        </div>`
    );
    
    // Add BottomBanner before closing StructuredDataLayout
    content = content.replace(
      /(\s*)(<FAQ[^>]*\/>\s*)(\s*)(<\/div>\s*)(\s*)(<\/StructuredDataLayout>)/,
      '$1$2$3        <BottomBanner />\n$4$5$6'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all tool pages
console.log('🚀 Updating tool pages with ad components...\n');

toolPages.forEach(updateToolPage);

console.log('\n✨ All tool pages updated successfully!');
