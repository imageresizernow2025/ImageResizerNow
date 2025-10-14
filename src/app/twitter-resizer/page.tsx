import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
// import { AdWrapper } from '@/components/ads/AdWrapper'; // Disabled
import { ArrowLeft, CheckCircle2, Twitter, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Image Resizer - Perfect Twitter/X Dimensions | ImageResizerNow',
  description: 'Resize images for Twitter/X posts, headers, and cards. Get exact Twitter dimensions: 1600x900 posts, 1500x500 headers, 1200x675 cards. Free online tool.',
  keywords: 'twitter resizer, twitter image size, twitter post size, twitter header size, twitter card size, resize for twitter, twitter dimensions, x.com resizer',
  openGraph: {
    title: 'Twitter Image Resizer - Perfect Twitter/X Dimensions',
    description: 'Resize images for Twitter/X posts, headers, and cards. Get exact Twitter dimensions: 1600x900 posts, 1500x500 headers, 1200x675 cards.',
    url: 'https://imageresizernow.com/twitter-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Image Resizer - Perfect Twitter/X Dimensions',
    description: 'Resize images for Twitter/X posts, headers, and cards. Get exact Twitter dimensions: 1600x900 posts, 1500x500 headers, 1200x675 cards.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/twitter-resizer',
  },
};

const features = [
    {
      icon: <Twitter className="h-8 w-8 text-primary" />,
      title: 'Twitter Posts',
      description: 'Square: 1200×1200px, Landscape: 1600×900px, Portrait: 900×1600px',
    },
    {
        icon: <Twitter className="h-8 w-8 text-primary" />,
        title: 'Twitter Headers',
        description: 'Header Image: 1500×500px, Profile Picture: 400×400px, Card Image: 1200×675px',
    },
    {
        icon: <Twitter className="h-8 w-8 text-primary" />,
        title: 'Twitter Cards',
        description: 'Summary Card: 1200×675px, Large Image: 1200×600px, App Card: 800×418px',
    },
  ];

const faqItems = [
  {
    question: "What are the exact Twitter/X image dimensions?",
    answer: "Twitter posts: 1600x900px (landscape), 1200x1200px (square), 900x1600px (portrait). Header images: 1500x500px. Profile pictures: 400x400px. Twitter cards: 1200x675px."
  },
  {
    question: "What size should I use for Twitter header images?",
    answer: "Twitter header images should be 1500x500px for optimal display. This ensures your header looks great on both desktop and mobile devices. Our tool automatically crops and resizes to these exact dimensions."
  },
  {
    question: "Can I resize images for Twitter cards?",
    answer: "Yes! Our Twitter resizer supports all Twitter card formats including summary cards (1200x675px), large image cards (1200x600px), and app cards (800x418px). Each format is optimized for maximum engagement."
  },
  {
    question: "What's the best aspect ratio for Twitter posts?",
    answer: "Twitter posts work best with a 16:9 aspect ratio (1600x900px) for landscape images. Square images (1200x1200px) also perform well. Portrait images (900x1600px) are great for mobile engagement."
  },
  {
    question: "How do I resize for Twitter profile pictures?",
    answer: "Twitter profile pictures should be 400x400px (square format). Our tool can resize your images to this exact dimension, ensuring your profile picture looks professional and clear."
  },
  {
    question: "Can I batch resize multiple images for Twitter?",
    answer: "Absolutely! You can upload multiple images and resize them all to the same Twitter dimensions. This is perfect for businesses managing multiple Twitter accounts or running campaigns."
  },
  {
    question: "What image formats work best for Twitter?",
    answer: "Twitter supports JPG, PNG, and GIF formats. JPG is recommended for photos as it provides better compression, while PNG is better for graphics with transparency. Our tool supports all these formats."
  },
  {
    question: "Will resizing affect image quality on Twitter?",
    answer: "Our resizer maintains high quality while optimizing for Twitter's requirements. We use advanced algorithms to ensure your images look crisp and professional when uploaded to Twitter/X."
  }
];

export default function TwitterResizerPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Twitter Image Resizer",
      "description": "Step-by-step guide to resize images for Twitter",
      "url": "https://imageresizernow.com/twitter-resizer",
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
          "text": "Upload your image to the Twitter resizer. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Twitter Format",
          "text": "Select the Twitter format: Posts (1600x900px), Header Image (1500x500px), Profile Picture (400x400px), or Twitter Cards (1200x675px)."
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
          "text": "Download your perfectly sized image ready for Twitter upload with optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Twitter Image Resizer",
      "url": "https://imageresizernow.com/twitter-resizer",
      "description": "Free online Twitter image resizer for social media",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Twitter Posts - 1600x900px (landscape)",
        "Header Images - 1500x500px",
        "Profile Pictures - 400x400px",
        "Twitter Cards - 1200x675px",
        "Summary Cards - 1200x600px",
        "High Quality Output - Optimized for Twitter",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Twitter Image Resizer",
      "url": "https://imageresizernow.com/twitter-resizer",
      "description": "Free online Twitter image resizer that formats your images to perfect Twitter dimensions for posts, headers, and cards. Get the exact sizes Twitter recommends for maximum engagement.",
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
        <Breadcrumb items={[{ label: 'Twitter Image Resizer' }]} />
                {/* <AdWrapper type="top" /> */}
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Twitter Image Resizer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Resize your images to perfect Twitter/X dimensions for posts, headers, and cards. Get the exact sizes Twitter recommends for maximum engagement.
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
