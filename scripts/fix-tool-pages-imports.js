const fs = require('fs');
const path = require('path');

// List of tool pages to fix
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

// Function to fix imports
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has proper imports
    if (content.includes('import { ImageResizer }')) {
      console.log(`✅ ${filePath} already has proper imports`);
      return;
    }
    
    // Add all necessary imports at the top
    const imports = `import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, Download, Upload, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

`;
    
    // Add imports before metadata
    content = content.replace(/export const metadata: Metadata = \{/, imports + 'export const metadata: Metadata = {');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports for ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all tool pages
console.log('🚀 Fixing tool page imports...\n');

toolPages.forEach(fixImports);

console.log('\n✨ All tool page imports fixed!');
