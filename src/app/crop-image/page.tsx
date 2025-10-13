import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { ArrowLeft, CheckCircle2, Crop, Download, Upload, SlidersHorizontal, Scan } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop Image - Precise Image Cropping Tool Online Free | ImageResizerNow',
  description: 'Crop images with precise control over dimensions and aspect ratios. Perfect for social media posts, web optimization, and custom sizing. Free online tool.',
  keywords: 'crop image, image cropper, crop photos, crop pictures, image cropping tool, crop to size, aspect ratio crop, free image cropper, online crop tool',
  openGraph: {
    title: 'Crop Image - Precise Image Cropping Tool Online Free',
    description: 'Crop images with precise control over dimensions and aspect ratios. Perfect for social media posts, web optimization, and custom sizing.',
    url: 'https://imageresizernow.com/crop-image',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crop Image - Precise Image Cropping Tool Online Free',
    description: 'Crop images with precise control over dimensions and aspect ratios. Perfect for social media posts, web optimization, and custom sizing.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/crop-image',
  },
};

const features = [
    {
      icon: <Crop className="h-8 w-8 text-primary" />,
      title: 'Precise Cropping',
      description: 'Crop images to exact dimensions with pixel-perfect precision. Maintain aspect ratios or crop to custom sizes.',
    },
    {
      icon: <SlidersHorizontal className="h-8 w-8 text-primary" />,
      title: 'Aspect Ratio Control',
      description: 'Choose from preset aspect ratios for social media or create custom dimensions for your specific needs.',
    },
    {
      icon: <Scan className="h-8 w-8 text-primary" />,
      title: 'Smart Cropping',
      description: 'Our smart cropping algorithm automatically centers the most important parts of your image.',
    },
  ];

const faqItems = [
  {
    question: "How precise is the image cropping?",
    answer: "Our image cropper offers pixel-perfect precision, allowing you to crop images to exact dimensions. You can specify exact width and height values or use preset aspect ratios for consistent results."
  },
  {
    question: "Can I crop to specific aspect ratios?",
    answer: "Yes! Our tool includes preset aspect ratios for social media platforms (1:1, 16:9, 9:16, 4:3, 3:4) and allows you to create custom aspect ratios for your specific needs."
  },
  {
    question: "Can I crop multiple images at once?",
    answer: "Absolutely! Our batch cropping feature allows you to upload and crop multiple images simultaneously. This is perfect for preparing image collections with consistent dimensions."
  },
  {
    question: "How does smart cropping work?",
    answer: "Our smart cropping algorithm automatically centers the most important parts of your image when cropping. It analyzes the image content to ensure the most visually appealing result."
  },
  {
    question: "Can I maintain aspect ratio while cropping?",
    answer: "Yes! You can choose to maintain the original aspect ratio or crop to specific dimensions. The tool provides options for both approaches depending on your requirements."
  },
  {
    question: "Is my data secure when cropping images?",
    answer: "Absolutely! All image cropping happens in your browser using client-side technology. Your images are never uploaded to our servers, ensuring complete privacy and security."
  },
  {
    question: "What's the maximum file size I can crop?",
    answer: "You can crop images up to 50MB in size. For very large images, we recommend cropping them in smaller batches for optimal performance and user experience."
  },
  {
    question: "Can I preview the cropped result before downloading?",
    answer: "Yes! After cropping, you can preview the result and see the exact dimensions. This helps you ensure the cropped image meets your requirements before downloading."
  }
];

export default function CropImagePage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Crop Image Tool",
      "description": "Step-by-step guide to crop images with precision",
      "url": "https://imageresizernow.com/crop-image",
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
          "text": "Upload your image to the cropper. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Select Crop Area",
          "text": "Choose the area to crop by dragging the selection box or use preset aspect ratios for social media."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Adjust Settings",
          "text": "Fine-tune the crop area and choose whether to maintain aspect ratio or crop to exact dimensions."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download Cropped Image",
          "text": "Download your perfectly cropped image with precise dimensions and optimal quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Crop Image",
      "url": "https://imageresizernow.com/crop-image",
      "description": "Free online image cropper for precise cropping",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Precise Cropping - Pixel-perfect accuracy",
        "Aspect Ratio Control - Preset and custom ratios",
        "Smart Cropping - Auto-centers important content",
        "Batch Processing - Crop multiple images",
        "Preview Function - See results before download",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "High Quality Output - Maintains image quality"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Crop Image",
      "url": "https://imageresizernow.com/crop-image",
      "description": "Free online image cropper that provides precise control over dimensions and aspect ratios. Perfect for social media posts, web optimization, and custom sizing with pixel-perfect accuracy.",
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
        <Breadcrumb items={[{ label: 'Crop Image' }]} />
                <AdWrapper type="top" />
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Crop Image
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Crop your images with precise control over dimensions and aspect ratios. Perfect for social media posts and web optimization.
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
                    <p className="text-sm text-muted-foreground">Crop multiple images at once</p>
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
