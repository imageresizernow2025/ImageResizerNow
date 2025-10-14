import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
// import { AdWrapper } from '@/components/ads/AdWrapper'; // Disabled
import { ArrowLeft, CheckCircle2, RefreshCw, Download, Upload, Layers, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Converter - Convert JPG, PNG, WebP Online Free | ImageResizerNow',
  description: 'Convert images between JPG, PNG, and WebP formats online for free. Batch convert multiple images with quality control and optimization. No software needed.',
  keywords: 'image converter, convert jpg to png, convert png to jpg, convert to webp, image format converter, batch image converter, online image converter, free image converter',
  openGraph: {
    title: 'Image Converter - Convert JPG, PNG, WebP Online Free',
    description: 'Convert images between JPG, PNG, and WebP formats online for free. Batch convert multiple images with quality control and optimization.',
    url: 'https://imageresizernow.com/image-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Converter - Convert JPG, PNG, WebP Online Free',
    description: 'Convert images between JPG, PNG, and WebP formats online for free. Batch convert multiple images with quality control and optimization.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/image-converter',
  },
};

const features = [
    {
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
      title: 'Format Conversion',
      description: 'Convert between JPG, PNG, and WebP formats with a single click. Choose the best format for your needs.',
    },
    {
      icon: <Layers className="h-8 w-8 text-primary" />,
      title: 'Batch Processing',
      description: 'Convert multiple images at once to save time. Perfect for large batches of images.',
    },
    {
      icon: <SlidersHorizontal className="h-8 w-8 text-primary" />,
      title: 'Quality Control',
      description: 'Adjust quality settings for each format to optimize file size and visual quality.',
    },
  ];

const faqItems = [
  {
    question: "What image formats can I convert?",
    answer: "Our image converter supports JPG, JPEG, PNG, and WebP formats. You can convert between any of these formats, choosing the best format for your specific needs and use case."
  },
  {
    question: "When should I use JPG vs PNG vs WebP?",
    answer: "Use JPG for photos and images with many colors. Use PNG for graphics with transparency or sharp edges. Use WebP for web images as it offers better compression than JPG while maintaining quality."
  },
  {
    question: "Can I convert multiple images at once?",
    answer: "Yes! Our batch conversion feature allows you to upload and convert multiple images simultaneously. This is perfect for converting entire photo collections or website image libraries."
  },
  {
    question: "Will converting affect image quality?",
    answer: "Our converter maintains high quality during format conversion. You can adjust quality settings for each format to optimize file size and visual quality based on your specific requirements."
  },
  {
    question: "Is my data secure when converting images?",
    answer: "Absolutely! All image conversion happens in your browser using client-side technology. Your images are never uploaded to our servers, ensuring complete privacy and security. We don't store or access your files."
  },
  {
    question: "What's the maximum file size I can convert?",
    answer: "You can convert images up to 50MB in size. For very large images, we recommend converting them in smaller batches for optimal performance and user experience."
  },
  {
    question: "Can I resize images while converting?",
    answer: "Yes! Our image converter also includes resizing capabilities. You can convert formats and resize images in a single operation, saving time and ensuring consistency across your image library."
  },
  {
    question: "How do I choose the right format for my needs?",
    answer: "For photos: use JPG. For graphics with transparency: use PNG. For web optimization: use WebP. Our tool provides recommendations based on your image content and intended use."
  }
];

export default function ImageConverterPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Image Converter",
      "description": "Step-by-step guide to convert image formats",
      "url": "https://imageresizernow.com/image-converter",
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
          "text": "Upload your image to the converter. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Output Format",
          "text": "Select the desired output format: JPG for photos, PNG for graphics with transparency, or WebP for web optimization."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Adjust Quality Settings",
          "text": "Customize quality settings for the output format to optimize file size and visual quality."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download Converted Image",
          "text": "Download your image in the new format with optimized quality and file size."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Converter",
      "url": "https://imageresizernow.com/image-converter",
      "description": "Free online image converter for format conversion",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Format Conversion - JPG, PNG, WebP",
        "Quality Control - Adjustable settings",
        "Batch Processing - Convert multiple images",
        "Smart Recommendations - Best format suggestions",
        "Preview Function - See results before download",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "High Quality Output - Maintains image quality"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Image Converter",
      "url": "https://imageresizernow.com/image-converter",
      "description": "Free online image converter that converts images between JPG, PNG, and WebP formats with quality control and optimization. Perfect for format compatibility and web optimization.",
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
        <Breadcrumb items={[{ label: 'Image Converter' }]} />
                {/* <AdWrapper type="top" /> */}
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Image Converter
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Convert images between JPG, PNG, and WebP formats online for free. Batch convert multiple images with quality control and optimization.
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
                    <p className="text-sm text-muted-foreground">Convert multiple images at once</p>
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
