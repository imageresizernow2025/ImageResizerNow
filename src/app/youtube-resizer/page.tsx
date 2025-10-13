import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, Youtube, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Resizer - Perfect YouTube Dimensions | ImageResizerNow',
  description: 'Resize images for YouTube thumbnails, channel art, and shorts. Get exact YouTube dimensions: 1280x720 thumbnails, 2560x1440 channel art, 1080x1920 shorts. Free online tool.',
  keywords: 'youtube resizer, youtube thumbnail size, youtube channel art size, youtube shorts size, resize for youtube, youtube dimensions, youtube thumbnail maker, youtube banner size',
  openGraph: {
    title: 'YouTube Thumbnail Resizer - Perfect YouTube Dimensions',
    description: 'Resize images for YouTube thumbnails, channel art, and shorts. Get exact YouTube dimensions: 1280x720 thumbnails, 2560x1440 channel art, 1080x1920 shorts.',
    url: 'https://imageresizernow.com/youtube-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Thumbnail Resizer - Perfect YouTube Dimensions',
    description: 'Resize images for YouTube thumbnails, channel art, and shorts. Get exact YouTube dimensions: 1280x720 thumbnails, 2560x1440 channel art, 1080x1920 shorts.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/youtube-resizer',
  },
};

const features = [
    {
      icon: <Youtube className="h-8 w-8 text-primary" />,
      title: 'YouTube Thumbnails',
      description: 'Thumbnail: 1280×720px, Min Size: 640×360px, Max Size: 1920×1080px',
    },
    {
        icon: <Youtube className="h-8 w-8 text-primary" />,
        title: 'Channel Art',
        description: 'Channel Art: 2560×1440px, Channel Icon: 800×800px, Banner: 2560×1440px',
    },
    {
        icon: <Youtube className="h-8 w-8 text-primary" />,
        title: 'YouTube Shorts',
        description: 'Shorts: 1080×1920px, Vertical: 9:16 aspect ratio, Min Duration: 15 seconds',
    },
  ];

const faqItems = [
  {
    question: "What are the exact YouTube image dimensions?",
    answer: "YouTube thumbnails: 1280x720px (16:9 aspect ratio). Channel art: 2560x1440px. Channel icon: 800x800px. YouTube Shorts: 1080x1920px (9:16 aspect ratio)."
  },
  {
    question: "What size should I use for YouTube thumbnails?",
    answer: "YouTube thumbnails should be 1280x720px for optimal display. This ensures your thumbnail looks great on all devices and platforms. Our tool automatically crops and resizes to these exact dimensions."
  },
  {
    question: "Can I resize images for YouTube channel art?",
    answer: "Yes! Our YouTube resizer supports channel art (2560x1440px) and channel icons (800x800px). Channel art displays differently on various devices, so proper sizing is crucial for professional appearance."
  },
  {
    question: "What's the best aspect ratio for YouTube thumbnails?",
    answer: "YouTube thumbnails work best with a 16:9 aspect ratio (1280x720px). This is the standard format that YouTube recommends and ensures your thumbnail looks great across all viewing platforms."
  },
  {
    question: "How do I resize for YouTube Shorts?",
    answer: "YouTube Shorts should be 1080x1920px (9:16 aspect ratio). This vertical format is perfect for mobile viewing and ensures your content looks great in the Shorts feed."
  },
  {
    question: "Can I batch resize multiple images for YouTube?",
    answer: "Absolutely! You can upload multiple images and resize them all to the same YouTube dimensions. This is perfect for content creators who need to prepare multiple thumbnails or channel art."
  },
  {
    question: "What image formats work best for YouTube?",
    answer: "YouTube supports JPG, PNG, and GIF formats. JPG is recommended for thumbnails as it provides better compression, while PNG is better for graphics with transparency. Our tool supports all these formats."
  },
  {
    question: "Will resizing affect image quality on YouTube?",
    answer: "Our resizer maintains high quality while optimizing for YouTube's requirements. We use advanced algorithms to ensure your images look crisp and professional when uploaded to YouTube."
  }
];

export default function YouTubeResizerPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use YouTube Thumbnail Resizer",
      "description": "Step-by-step guide to resize images for YouTube",
      "url": "https://imageresizernow.com/youtube-resizer",
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
          "text": "Upload your image to the YouTube resizer. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose YouTube Format",
          "text": "Select the YouTube format: Thumbnails (1280x720px), Channel Art (2560x1440px), Channel Icon (800x800px), or Shorts (1080x1920px)."
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
          "text": "Download your perfectly sized image ready for YouTube upload with optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "YouTube Thumbnail Resizer",
      "url": "https://imageresizernow.com/youtube-resizer",
      "description": "Free online YouTube thumbnail resizer for video creators",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "YouTube Thumbnails - 1280x720px (16:9)",
        "Channel Art - 2560x1440px",
        "Channel Icons - 800x800px",
        "YouTube Shorts - 1080x1920px (9:16)",
        "High Quality Output - Optimized for YouTube",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "Batch Processing - Resize multiple images"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "YouTube Thumbnail Resizer",
      "url": "https://imageresizernow.com/youtube-resizer",
      "description": "Free online YouTube thumbnail resizer that formats your images to perfect YouTube dimensions for thumbnails, channel art, and shorts. Get the exact sizes YouTube recommends for maximum click-through rates.",
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
        <Breadcrumb items={[{ label: 'YouTube Thumbnail Resizer' }]} />
                <AdWrapper type="top" />
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                YouTube Thumbnail Resizer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Resize your images to perfect YouTube dimensions for thumbnails, channel art, and shorts. Get the exact sizes YouTube recommends for maximum click-through rates.
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
