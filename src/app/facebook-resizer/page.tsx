import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
// import { AdWrapper } from '@/components/ads/AdWrapper'; // Disabled
import { ArrowLeft, CheckCircle2, Facebook, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facebook Image Resizer - Perfect Facebook Dimensions | ImageResizerNow',
  description: 'Resize images for Facebook posts, covers, events, and ads. Get exact Facebook dimensions: 1200x630 posts, 1200x315 covers, 1080x1920 story ads. Free online tool.',
  keywords: 'facebook resizer, facebook image size, facebook post size, facebook cover size, facebook ad size, resize for facebook, facebook dimensions, facebook cover photo size',
  openGraph: {
    title: 'Facebook Image Resizer - Perfect Facebook Dimensions',
    description: 'Resize images for Facebook posts, covers, events, and ads. Get exact Facebook dimensions: 1200x630 posts, 1200x315 covers, 1080x1920 story ads.',
    url: 'https://imageresizernow.com/facebook-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facebook Image Resizer - Perfect Facebook Dimensions',
    description: 'Resize images for Facebook posts, covers, events, and ads. Get exact Facebook dimensions: 1200x630 posts, 1200x315 covers, 1080x1920 story ads.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/facebook-resizer',
  },
};

const features = [
    {
      icon: <Facebook className="h-8 w-8 text-primary" />,
      title: 'Facebook Posts',
      description: 'Square: 1200×1200px, Landscape: 1200×630px, Portrait: 630×1200px',
    },
    {
        icon: <Facebook className="h-8 w-8 text-primary" />,
        title: 'Facebook Covers',
        description: 'Cover Photo: 1200×315px, Profile Picture: 170×170px, Event Cover: 1920×1080px',
    },
    {
        icon: <Facebook className="h-8 w-8 text-primary" />,
        title: 'Facebook Ads',
        description: 'Feed Ad: 1200×628px, Story Ad: 1080×1920px, Carousel Ad: 1080×1080px',
    },
  ];

const faqItems = [
  {
    question: "What are the exact Facebook image dimensions?",
    answer: "Facebook posts: 1200x630px (landscape), 1200x1200px (square), 630x1200px (portrait). Cover photos: 1200x315px. Profile pictures: 170x170px. Story ads: 1080x1920px (9:16 aspect ratio)."
  },
  {
    question: "What size should I use for Facebook cover photos?",
    answer: "Facebook cover photos should be 1200x315px for optimal display. This ensures your cover looks great on both desktop and mobile devices. Our tool automatically crops and resizes to these exact dimensions."
  },
  {
    question: "Can I resize images for Facebook ads?",
    answer: "Yes! Our Facebook resizer supports all Facebook ad formats including feed ads (1200x628px), story ads (1080x1920px), and carousel ads (1080x1080px). Each format is optimized for maximum engagement."
  },
  {
    question: "What's the best aspect ratio for Facebook posts?",
    answer: "Facebook posts work best with a 1.91:1 aspect ratio (1200x630px) for landscape images. Square images (1200x1200px) also perform well. Portrait images (630x1200px) are great for mobile engagement."
  },
  {
    question: "How do I resize for Facebook events?",
    answer: "Facebook event covers should be 1920x1080px (16:9 aspect ratio). Our tool can resize your images to this exact dimension, ensuring your event cover looks professional and engaging."
  },
  {
    question: "Can I batch resize multiple images for Facebook?",
    answer: "Absolutely! You can upload multiple images and resize them all to the same Facebook dimensions. This is perfect for businesses managing multiple Facebook pages or running ad campaigns."
  },
  {
    question: "What image formats work best for Facebook?",
    answer: "Facebook supports JPG, PNG, and GIF formats. JPG is recommended for photos as it provides better compression, while PNG is better for graphics with transparency. Our tool supports all these formats."
  },
  {
    question: "Will resizing affect image quality on Facebook?",
    answer: "Our resizer maintains high quality while optimizing for Facebook's requirements. We use advanced algorithms to ensure your images look crisp and professional when uploaded to Facebook."
  }
];

export default function FacebookResizerPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Facebook Image Resizer",
      "description": "Step-by-step guide to resize images for Facebook",
      "url": "https://imageresizernow.com/facebook-resizer",
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
          "text": "Upload your image to the Facebook resizer. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Facebook Format",
          "text": "Select the Facebook format: Posts (1200x630px), Cover Photo (1200x315px), Profile Picture (170x170px), or Story Ads (1080x1920px)."
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
          "text": "Download your perfectly sized image ready for Facebook upload with optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Facebook Image Resizer",
      "url": "https://imageresizernow.com/facebook-resizer",
      "description": "Free online Facebook image resizer for social media",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Facebook Posts - 1200x630px (landscape)",
        "Cover Photos - 1200x315px",
        "Profile Pictures - 170x170px",
        "Story Ads - 1080x1920px (9:16)",
        "Event Covers - 1920x1080px",
        "High Quality Output - Optimized for Facebook",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Facebook Image Resizer",
      "url": "https://imageresizernow.com/facebook-resizer",
      "description": "Free online Facebook image resizer that formats your images to perfect Facebook dimensions for posts, covers, events, and ads. Get the exact sizes Facebook recommends for maximum engagement.",
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
        <Breadcrumb items={[{ label: 'Facebook Image Resizer' }]} />
                {/* <AdWrapper type="top" /> */}
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Facebook Image Resizer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Resize your images to perfect Facebook dimensions for posts, covers, events, and ads. Get the exact sizes Facebook recommends for optimal engagement.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
            {features.map((feature) => (
                <Card key={feature.title}>
                    <CardHeader className='items-center text-center'>
                        {feature.icon}
                        <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-center">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

                {/* Desktop sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ImageResizer />
          </div>
          <div className="lg:w-80">
            {/* <AdWrapper type="sidebar" /> */}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="font-semibold">Max 50MB per file</h3>
                    <p className="text-sm text-muted-foreground">High-resolution supported</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="font-semibold">Batch Processing</h3>
                    <p className="text-sm text-muted-foreground">Resize multiple images at once</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="font-semibold">High Quality Output</h3>
                    <p className="text-sm text-muted-foreground">Best-in-class image quality</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="font-semibold">Fast Client-Side Processing</h3>
                    <p className="text-sm text-muted-foreground">Images processed in your browser for speed & privacy</p>
                </div>
            </div>
        </div>

        <FAQ items={faqItems} />
              {/* <AdWrapper type="bottom" /> */}
</div>
    </StructuredDataLayout>
  );
}
