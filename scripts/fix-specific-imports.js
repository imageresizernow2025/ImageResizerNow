const fs = require('fs');
const path = require('path');

// Specific imports for each tool page
const toolPageImports = {
  'src/app/bulk-resize/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Download', 'Upload', 'Zap'],
  'src/app/crop-image/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Crop', 'Download', 'Upload', 'SlidersHorizontal', 'Scan'],
  'src/app/facebook-resizer/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Facebook', 'Download', 'Upload'],
  'src/app/image-compressor/page.tsx': ['ArrowLeft', 'CheckCircle2', 'FileImage', 'Download', 'Upload', 'Sparkles', 'SlidersHorizontal'],
  'src/app/image-converter/page.tsx': ['ArrowLeft', 'CheckCircle2', 'RefreshCw', 'Download', 'Upload'],
  'src/app/instagram-resizer/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Instagram', 'Download', 'Upload'],
  'src/app/shopify-resizer/page.tsx': ['ArrowLeft', 'CheckCircle2', 'ShoppingBag', 'Download', 'Upload'],
  'src/app/twitter-resizer/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Twitter', 'Download', 'Upload'],
  'src/app/youtube-resizer/page.tsx': ['ArrowLeft', 'CheckCircle2', 'Youtube', 'Download', 'Upload']
};

// Function to fix specific imports
function fixSpecificImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const icons = toolPageImports[filePath];
    if (!icons) {
      console.log(`⚠️ No specific imports defined for ${filePath}`);
      return;
    }
    
    // Create the specific import line
    const iconImports = `import { ${icons.join(', ')} } from 'lucide-react';`;
    
    // Replace the generic import with specific one
    content = content.replace(
      /import { ArrowLeft, CheckCircle2, Download, Upload, Zap } from 'lucide-react';/,
      iconImports
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed specific imports for ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all tool pages
console.log('🚀 Fixing specific imports for tool pages...\n');

Object.keys(toolPageImports).forEach(fixSpecificImports);

console.log('\n✨ All specific imports fixed!');
