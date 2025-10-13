import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, Instagram, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Image Resizer - Perfect Instagram Dimensions | ImageResizerNow',
  description: 'Resize images for Instagram posts, stories, reels, and profile pictures. Get exact Instagram dimensions: 1080x1080 posts, 1080x1920 stories, 1080x1920 reels. Free online tool.',
  keywords: 'instagram resizer, instagram image size, instagram post size, instagram story size, instagram reels size, instagram profile picture size, resize for instagram, instagram dimensions',
  openGraph: {
    title: 'Instagram Image Resizer - Perfect Instagram Dimensions',
    description: 'Resize images for Instagram posts, stories, reels, and profile pictures. Get exact Instagram dimensions: 1080x1080 posts, 1080x1920 stories, 1080x1920 reels.',
    url: 'https://imageresizernow.com/instagram-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Image Resizer - Perfect Instagram Dimensions',
    description: 'Resize images for Instagram posts, stories, reels, and profile pictures. Get exact Instagram dimensions: 1080x1080 posts, 1080x1920 stories, 1080x1920 reels.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/instagram-resizer',
  },
};

import type { Metadata } from 'next';

const features = [
    {
      icon: <Instagram className="h-8 w-8 text-primary" />,
      title: 'Instagram Posts',
      description: 'Square: 1080×1080px, Portrait: 1080×1350px, Landscape: 1080×566px',
    },
    {
        icon: <Instagram className="h-8 w-8 text-primary" />,
        title: 'Instagram Stories',
        description: 'Stories: 1080×1920px, Reels: 1080×1920px, IGTV Cover: 420×654px',
    },
    {
        icon: <Instagram className="h-8 w-8 text-primary" />,
        title: 'Profile Pictures',
        description: 'Profile Pic: 320×320px, High Res: 400×400px, Minimum: 110×110px',
    },
  ];

const faqItems = [
  {
    question: "What are the exact Instagram image dimensions?",
    answer: "Instagram posts: 1080x1080px (square), 1080x1350px (portrait), 1080x566px (landscape). Stories and Reels: 1080x1920px (9:16 aspect ratio). Profile pictures: 320x320px minimum, but we recommend 400x400px for best quality."
  },
  {
    question: "Can I resize images for Instagram Stories?",
    answer: "Yes! Our Instagram resizer automatically formats images for Stories (1080x1920px). Stories use a 9:16 aspect ratio, perfect for vertical content that fills the entire screen on mobile devices."
  },
  {
    question: "What's the best size for Instagram Reels?",
    answer: "Instagram Reels work best at 1080x1920px (9:16 aspect ratio). This ensures your content looks great in both the Reels feed and when viewed in full screen. Our tool automatically crops and resizes to these exact dimensions."
  },
  {
    question: "How do I resize for Instagram profile pictures?",
    answer: "Instagram profile pictures are displayed as circles, so we recommend uploading a square image. Our tool can resize to 400x400px for optimal quality, or 320x320px for the minimum requirement."
  },
  {
    question: "Can I batch resize multiple images for Instagram?",
    answer: "Absolutely! You can upload multiple images and resize them all to the same Instagram dimensions. This is perfect for content creators who need to prepare multiple posts or stories at once."
  },
  {
    question: "What image formats work best for Instagram?",
    answer: "Instagram supports JPG and PNG formats. JPG is recommended for photos as it provides better compression, while PNG is better for graphics with transparency. Our tool supports both formats."
  },
  {
    question: "Will resizing affect image quality on Instagram?",
    answer: "Our resizer maintains high quality while optimizing for Instagram's requirements. We use advanced algorithms to ensure your images look crisp and professional when uploaded to Instagram."
  },
  {
    question: "Can I preview how my image will look on Instagram?",
    answer: "Yes! After resizing, you can see exactly how your image will appear on Instagram. The tool shows you the final dimensions and maintains the correct aspect ratio for optimal display on the platform."
  }
];

export default function InstagramResizerPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Instagram Image Resizer",
      "description": "Step-by-step guide to resize images for Instagram",
      "url": "https://imageresizernow.com/instagram-resizer",
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
          "text": "Upload your image to the Instagram resizer. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Instagram Format",
          "text": "Select the Instagram format: Posts (1080x1080px), Stories (1080x1920px), Reels (1080x1920px), or Profile Picture (400x400px)."
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
          "text": "Download your perfectly sized image ready for Instagram upload with optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Instagram Image Resizer",
      "url": "https://imageresizernow.com/instagram-resizer",
      "description": "Free online Instagram image resizer for social media",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Instagram Posts - 1080x1080px (square)",
        "Instagram Stories - 1080x1920px (9:16)",
        "Instagram Reels - 1080x1920px (9:16)",
        "Profile Pictures - 400x400px (square)",
        "High Quality Output - Optimized for Instagram",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "Batch Processing - Resize multiple images"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Instagram Image Resizer",
      "url": "https://imageresizernow.com/instagram-resizer",
      "description": "Free online Instagram image resizer that formats your images to perfect Instagram dimensions for posts, stories, reels, and profile pictures. Get the exact sizes Instagram recommends for maximum engagement.",
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
        <Breadcrumb items={[{ label: 'Instagram Image Resizer' }]} />
        <AdWrapper type="top" />
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Instagram Image Resizer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Resize your images to perfect Instagram dimensions for posts, stories, reels, and profile pictures. Get the exact sizes Instagram recommends.
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
            <AdWrapper type="sidebar" />
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
        <AdWrapper type="bottom" />
      </div>
    </StructuredDataLayout>
  );
}
