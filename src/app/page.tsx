
import {
  Crop,
  Expand,
  Facebook,
  FileImage,
  Instagram,
  RefreshCw,
  ShoppingBag,
  Twitter,
  Upload,
  Youtube,
} from 'lucide-react';
import { ImageResizer } from '@/components/ImageResizer';
import { Card } from '@/components/ui/card';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { AMPAutoAds } from '@/components/ads/AMPAutoAds';
import Link from 'next/link';

const popularTools = [
  { name: 'Bulk Image Resizer', icon: <Expand className="h-6 w-6" />, href: '/bulk-resize' },
  { name: 'Image Compressor', icon: <FileImage className="h-6 w-6" />, href: '/image-compressor' },
  { name: 'Image Converter', icon: <RefreshCw className="h-6 w-6" />, href: '/image-converter' },
  { name: 'Crop Image', icon: <Crop className="h-6 w-6" />, href: '/crop-image' },
  { name: 'Shopify Resizer', icon: <ShoppingBag className="h-6 w-6" />, href: '/shopify-resizer' },
  { name: 'Instagram Resizer', icon: <Instagram className="h-6 w-6" />, href: '/instagram-resizer' },
  { name: 'Facebook Resizer', icon: <Facebook className="h-6 w-6" />, href: '/facebook-resizer' },
  { name: 'Twitter Resizer', icon: <Twitter className="h-6 w-6" />, href: '/twitter-resizer' },
  { name: 'YouTube Thumbnail', icon: <Youtube className="h-6 w-6" />, href: '/youtube-resizer' },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 md:py-6">
      {/* AMP Auto Ads */}
      <AMPAutoAds />
      
      <AdWrapper type="top" />
      <div className="mt-4">
        <ImageResizer />
      </div>
      <section className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Popular Tools
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {popularTools.slice(0, 5).map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="flex h-24 flex-col items-center justify-center gap-2 p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground">
                {tool.icon}
                <span className="font-semibold">{tool.name}</span>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Ad between tool rows */}
        <AdWrapper type="between-tools" />
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {popularTools.slice(5).map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="flex h-24 flex-col items-center justify-center gap-2 p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground">
                {tool.icon}
                <span className="font-semibold">{tool.name}</span>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Ad after last tool */}
        <div className="mt-8">
          <AdWrapper type="between-tools" />
        </div>
      </section>
      <AdWrapper type="bottom" />
    </div>
  );
}
