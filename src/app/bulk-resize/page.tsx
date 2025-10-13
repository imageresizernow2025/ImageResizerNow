import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, Download, Upload, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk Image Resizer - Resize Multiple Images at Once | ImageResizerNow',
  description: 'Resize multiple images simultaneously with our bulk image resizer. Batch process JPG, PNG, WebP images with custom dimensions. Download all resized images as ZIP. Free online tool.',
  keywords: 'bulk image resizer, batch image resize, multiple image resize, resize many images, batch image processing, image batch tool, bulk resize photos, mass image resize',
  openGraph: {
    title: 'Bulk Image Resizer - Resize Multiple Images at Once',
    description: 'Resize multiple images simultaneously with our bulk image resizer. Batch process JPG, PNG, WebP images with custom dimensions.',
    url: 'https://imageresizernow.com/bulk-resize',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Image Resizer - Resize Multiple Images at Once',
    description: 'Resize multiple images simultaneously with our bulk image resizer. Batch process JPG, PNG, WebP images with custom dimensions.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/bulk-resize',
  },
};

import type { Metadata } from 'next';

const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: 'Upload Multiple Images',
      description: 'Drag and drop multiple images or select them from your device. Supports JPG, PNG, and WebP formats.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Batch Processing',
      description: 'Process all images simultaneously with custom dimensions, quality settings, and format conversion.',
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: 'Download All',
      description: 'Download all resized images as individual files or as a convenient ZIP archive.',
    },
  ];

const faqItems = [
  {
    question: "How many images can I resize at once?",
    answer: "You can upload and resize up to 50 images simultaneously. Each image can be up to 50MB in size. For larger batches, we recommend processing them in smaller groups for optimal performance."
  },
  {
    question: "What image formats are supported for bulk resizing?",
    answer: "Our bulk image resizer supports JPG, JPEG, PNG, WebP, and GIF formats. You can convert between these formats during the resizing process. The output format will be the same as the input unless you choose to convert."
  },
  {
    question: "Can I set different dimensions for each image?",
    answer: "Yes! You can set custom dimensions for each image individually, or apply the same dimensions to all images in your batch. The tool allows you to specify width, height, or both, and maintains aspect ratio when needed."
  },
  {
    question: "How do I download all resized images?",
    answer: "After processing, you can download all resized images as individual files or as a convenient ZIP archive. The ZIP option is perfect for large batches and makes it easy to organize your resized images."
  },
  {
    question: "Is my data secure when using the bulk resizer?",
    answer: "Absolutely! All image processing happens in your browser using client-side technology. Your images are never uploaded to our servers, ensuring complete privacy and security. We don't store or access your files."
  },
  {
    question: "What's the maximum file size for bulk resizing?",
    answer: "Each individual image can be up to 50MB in size. There's no limit on the total batch size, but we recommend processing very large batches in smaller groups for the best performance and user experience."
  },
  {
    question: "Can I maintain aspect ratio while resizing?",
    answer: "Yes! When you specify only width or height, the tool automatically maintains the original aspect ratio. You can also choose to crop images to exact dimensions if needed for specific requirements."
  },
  {
    question: "Does the bulk resizer work on mobile devices?",
    answer: "Yes, our bulk image resizer is fully responsive and works on all devices including smartphones and tablets. However, for large batches, we recommend using a desktop or laptop for the best performance."
  }
];

export default function BulkResizePage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Bulk Image Resizer",
      "description": "Step-by-step guide to use Bulk Image Resizer for batch image processing",
      "url": "https://imageresizernow.com/bulk-resize",
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
          "name": "Upload Multiple Images",
          "text": "Drag and drop multiple images or select them from your device. Supports JPG, PNG, and WebP formats up to 50MB each."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Set Dimensions",
          "text": "Choose custom dimensions for all images or set individual sizes. You can maintain aspect ratio or crop to exact dimensions."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Process Images",
          "text": "Click process to resize all images simultaneously. Our tool processes images in your browser for speed and privacy."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download Results",
          "text": "Download all resized images as individual files or as a convenient ZIP archive for easy organization."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Bulk Image Resizer",
      "url": "https://imageresizernow.com/bulk-resize",
      "description": "Free online bulk image resizer for batch image processing",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Batch Processing - Resize multiple images at once",
        "Custom Dimensions - Set width, height, or both",
        "Format Support - JPG, PNG, WebP, GIF",
        "ZIP Download - Download all images as archive",
        "Client-Side Processing - Images processed in browser",
        "High Quality Output - Best-in-class image quality",
        "Privacy Protected - No server upload required",
        "Mobile Responsive - Works on all devices"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Bulk Image Resizer",
      "url": "https://imageresizernow.com/bulk-resize",
      "description": "Free online bulk image resizer that allows you to resize multiple images simultaneously with custom dimensions. Perfect for batch processing photos, optimizing image collections, and preparing images for web use.",
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
        <Breadcrumb items={[{ label: 'Bulk Image Resizer' }]} />
        <AdWrapper type="top" />
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Bulk Image Resizer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Resize multiple images at once with our powerful bulk image resizer. Perfect for social media, web optimization, and batch processing.
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
