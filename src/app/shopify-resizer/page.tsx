import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, ShoppingBag, Download, Upload, Grid, Monitor, ImageIcon, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopify Image Resizer - Perfect Shopify Dimensions | ImageResizerNow',
  description: 'Resize images for Shopify stores: product images, collection images, slideshow banners. Get exact Shopify dimensions: 2048x2048 products, 1920x1080 banners. Free online tool.',
  keywords: 'shopify resizer, shopify image size, shopify product image size, shopify banner size, resize for shopify, shopify dimensions, shopify image optimizer, ecommerce image resizer',
  openGraph: {
    title: 'Shopify Image Resizer - Perfect Shopify Dimensions',
    description: 'Resize images for Shopify stores: product images, collection images, slideshow banners. Get exact Shopify dimensions: 2048x2048 products, 1920x1080 banners.',
    url: 'https://imageresizernow.com/shopify-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopify Image Resizer - Perfect Shopify Dimensions',
    description: 'Resize images for Shopify stores: product images, collection images, slideshow banners. Get exact Shopify dimensions: 2048x2048 products, 1920x1080 banners.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/shopify-resizer',
  },
};



const features = [
  {
    title: 'Product Images',
    icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
    description: 'Perfect square images for your product catalog with zoom functionality',
    presets: ['2048x2048 (Ideal)', '800x800 (Min Zoom)'],
  },
  {
    title: 'Collection Images',
    icon: <Grid className="h-8 w-8 text-green-600" />,
    description: 'Consistent 1:1 aspect ratio for clean category grids',
    presets: ['1024x1024'],
  },
  {
    title: 'Slideshow & Hero',
    icon: <Monitor className="h-8 w-8 text-purple-600" />,
    description: 'Desktop and mobile-optimized banner images',
    presets: ['1920x1080 (Desktop)', '1080x1920 (Mobile)'],
  },
  {
    title: 'Logo Optimization',
    icon: <ImageIcon className="h-8 w-8 text-orange-600" />,
    description: 'Square and rectangular logo formats for all placements',
    presets: ['200x200 (Square)', '400x100 (Rectangular)'],
  },
];


const faqItems = [
  {
    question: "What are the exact Shopify image dimensions?",
    answer: "Shopify product images: 2048x2048px (ideal for zoom), minimum 800x800px. Collection images: 1024x1024px. Slideshow banners: 1920x1080px (desktop), 1080x1920px (mobile). Logo: 200x200px (square) or 400x100px (rectangular)."
  },
  {
    question: "What size should I use for Shopify product images?",
    answer: "Shopify product images should be 2048x2048px for optimal quality and zoom functionality. This square format ensures your products look professional and customers can zoom in to see details."
  },
  {
    question: "Can I resize images for Shopify collection pages?",
    answer: "Yes! Our Shopify resizer supports collection images at 1024x1024px. This ensures consistent grid layouts and professional appearance across your category pages."
  },
  {
    question: "What's the best size for Shopify slideshow banners?",
    answer: "Shopify slideshow banners work best at 1920x1080px for desktop and 1080x1920px for mobile. This ensures your banners look great across all devices and screen sizes."
  },
  {
    question: "How do I optimize images for Shopify's zoom feature?",
    answer: "To enable Shopify's zoom feature, use images that are at least 800x800px, with 2048x2048px being ideal. Our tool automatically optimizes for this feature while maintaining aspect ratios."
  },
  {
    question: "Can I batch resize multiple images for Shopify?",
    answer: "Absolutely! You can upload multiple images and resize them all to the same Shopify dimensions. This is perfect for store owners who need to prepare large product catalogs."
  },
  {
    question: "What image formats work best for Shopify?",
    answer: "Shopify supports JPG, PNG, and WebP formats. JPG is recommended for product photos as it provides better compression, while PNG is better for graphics with transparency."
  },
  {
    question: "Will resizing affect image quality on Shopify?",
    answer: "Our resizer maintains high quality while optimizing for Shopify's requirements. We use advanced algorithms to ensure your images look crisp and professional in your store."
  }
];

export default function ShopifyResizerPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Shopify Image Resizer",
      "description": "Step-by-step guide to resize images for Shopify",
      "url": "https://imageresizernow.com/shopify-resizer",
      "totalTime": "PT2M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Upload Your Image",
          "text": "Upload your image to the Shopify resizer. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Shopify Format",
          "text": "Select the Shopify format: Product Images (2048x2048px), Collection Images (1024x1024px), Slideshow Banners (1920x1080px), or Logo (200x200px)."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Adjust Settings",
          "text": "Customize quality settings and choose whether to maintain aspect ratio or crop to exact dimensions."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download Resized Image",
          "text": "Download your perfectly sized image ready for Shopify upload with optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Shopify Image Resizer",
      "url": "https://imageresizernow.com/shopify-resizer",
      "description": "Free online Shopify image resizer for e-commerce",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Product Images - 2048x2048px (zoom ready)",
        "Collection Images - 1024x1024px",
        "Slideshow Banners - 1920x1080px",
        "Logo Optimization - 200x200px",
        "Zoom Functionality - Optimized for Shopify",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "Batch Processing - Resize multiple images"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Shopify Image Resizer",
      "url": "https://imageresizernow.com/shopify-resizer",
      "description": "Free online Shopify image resizer that formats your images to perfect Shopify dimensions for products, collections, banners, and logos. Get the exact sizes Shopify recommends for optimal store performance.",
      "category": "Image Processing Tool",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <StructuredDataLayout structuredData={structuredData}>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Breadcrumb items={[{ label: 'Shopify Image Resizer' }]} />
      
              <AdWrapper type="top" />
<div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShoppingBag className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Shopify Image Resizer
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Optimize your Shopify store images with industry-standard presets. From product photos to collection banners, 
          get the perfect dimensions for professional presentation and optimal performance.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Zoom functionality ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Retina display optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Mobile responsive</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <div className="space-y-2">
                {feature.presets.map((preset) => (
                  <Badge key={preset} variant="secondary" className="text-xs">
                    {preset}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Shopify Image Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Ideal Size: 2048 x 2048 pixels</p>
                <p className="text-xs text-muted-foreground">High-resolution for zoom feature and retina displays</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Minimum: 800 x 800 pixels</p>
                <p className="text-xs text-muted-foreground">Smallest size that supports Shopify's zoom functionality</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Format: JPEG</p>
                <p className="text-xs text-muted-foreground">Best balance of quality and file size</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-green-600" />
                Collection Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Ideal Size: 1024 x 1024 pixels</p>
                <p className="text-xs text-muted-foreground">1:1 aspect ratio for uniform grid layout</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Consistency is Key</p>
                <p className="text-xs text-muted-foreground">Maintain same aspect ratio across all collection images</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Slideshow/Hero Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Desktop: 1920 x 1080 pixels</p>
                <p className="text-xs text-muted-foreground">16:9 aspect ratio for banners</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Mobile: 1080 x 1920 pixels</p>
                <p className="text-xs text-muted-foreground">Vertical format for mobile screens</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-orange-600" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Square: 200 x 200 pixels</p>
                <p className="text-xs text-muted-foreground">Versatile size for most placements</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Rectangular: 400 x 100 pixels</p>
                <p className="text-xs text-muted-foreground">For horizontal logo layouts</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Format: PNG</p>
                <p className="text-xs text-muted-foreground">For transparent backgrounds</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

              {/* Desktop sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ImageResizer />
          </div>
          <div className="lg:w-80">
            <AdWrapper type="sidebar" />
          </div>
        </div>

      <FAQ items={faqItems} />
            <AdWrapper type="bottom" />
</div>
  </StructuredDataLayout>
  );
}
