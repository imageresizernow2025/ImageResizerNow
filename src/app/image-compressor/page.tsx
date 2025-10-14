import { ImageResizer } from '@/components/ImageResizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { StructuredDataLayout } from '@/components/StructuredDataLayout';
// // import { AdWrapper } from '@/components/ads/AdWrapper'; // Disabled // Disabled
import { ArrowLeft, CheckCircle2, FileImage, Download, Upload, Sparkles, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - Reduce File Size Without Losing Quality | ImageResizerNow',
  description: 'Compress images to reduce file size by up to 90% while maintaining quality. Perfect for web optimization, faster loading times, and storage savings. Free online tool.',
  keywords: 'image compressor, compress images, reduce image size, image optimization, compress photos, reduce file size, image quality, web optimization',
  openGraph: {
    title: 'Image Compressor - Reduce File Size Without Losing Quality',
    description: 'Compress images to reduce file size by up to 90% while maintaining quality. Perfect for web optimization, faster loading times, and storage savings.',
    url: 'https://imageresizernow.com/image-compressor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor - Reduce File Size Without Losing Quality',
    description: 'Compress images to reduce file size by up to 90% while maintaining quality. Perfect for web optimization, faster loading times, and storage savings.',
  },
  alternates: {
    canonical: 'https://imageresizernow.com/image-compressor',
  },
};

const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Smart Compression',
      description: 'Our advanced compression algorithm reduces file size by up to 90% while preserving image quality.',
    },
    {
      icon: <SlidersHorizontal className="h-8 w-8 text-primary" />,
      title: 'Quality Control',
      description: 'Adjust compression levels with our quality slider to find the perfect balance between file size and image quality.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Privacy Protected',
      description: 'All images are processed securely and automatically deleted after 24 hours. Your privacy is our priority.',
    },
  ];

const faqItems = [
  {
    question: "How much can I reduce my image file size?",
    answer: "Our image compressor can reduce file size by up to 90% while maintaining visual quality. The exact compression depends on the original image format, quality, and your compression settings."
  },
  {
    question: "Will compressing my images affect their quality?",
    answer: "Our smart compression algorithm is designed to maintain visual quality while reducing file size. You can adjust the quality slider to find the perfect balance between file size and image quality for your needs."
  },
  {
    question: "What image formats can I compress?",
    answer: "Our image compressor supports JPG, JPEG, PNG, and WebP formats. You can compress images in their original format or convert them to a more efficient format during compression."
  },
  {
    question: "Can I compress multiple images at once?",
    answer: "Yes! Our batch compression feature allows you to upload and compress multiple images simultaneously. This is perfect for optimizing entire photo collections or website image libraries."
  },
  {
    question: "Is my data secure when compressing images?",
    answer: "Absolutely! All image compression happens in your browser using client-side technology. Your images are never uploaded to our servers, ensuring complete privacy and security. We don't store or access your files."
  },
  {
    question: "What's the maximum file size I can compress?",
    answer: "You can compress images up to 50MB in size. For very large images, we recommend compressing them in smaller batches for optimal performance and user experience."
  },
  {
    question: "How do I choose the right compression level?",
    answer: "Use our quality slider to adjust compression levels. Higher quality means larger file sizes but better image quality. Lower quality means smaller file sizes but may reduce image sharpness. Find the balance that works for your needs."
  },
  {
    question: "Can I preview the compressed image before downloading?",
    answer: "Yes! After compression, you can preview the result and see the file size reduction. This helps you ensure the compressed image meets your quality requirements before downloading."
  }
];

export default function ImageCompressorPage() {const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Image Compressor",
      "description": "Step-by-step guide to compress images and reduce file size",
      "url": "https://imageresizernow.com/image-compressor",
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
          "text": "Upload your image to the compressor. Supports JPG, PNG, and WebP formats up to 50MB."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Adjust Quality Settings",
          "text": "Use the quality slider to find the perfect balance between file size and image quality. Higher quality means larger files."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Preview Compression",
          "text": "Preview the compressed image and see the file size reduction before downloading."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download Compressed Image",
          "text": "Download your compressed image with reduced file size while maintaining visual quality."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Compressor",
      "url": "https://imageresizernow.com/image-compressor",
      "description": "Free online image compressor for reducing file size",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Smart Compression - Up to 90% size reduction",
        "Quality Control - Adjustable compression levels",
        "Format Support - JPG, PNG, WebP",
        "Batch Processing - Compress multiple images",
        "Preview Function - See results before download",
        "Client-Side Processing - Privacy protected",
        "Mobile Responsive - Works on all devices",
        "High Quality Output - Maintains visual quality"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Tool",
      "name": "Image Compressor",
      "url": "https://imageresizernow.com/image-compressor",
      "description": "Free online image compressor that reduces file size by up to 90% while maintaining visual quality. Perfect for web optimization, faster loading times, and storage savings.",
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
        <Breadcrumb items={[{ label: 'Image Compressor' }]} />
                {/* <AdWrapper type="top" /> */}
<div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Image Compressor
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Compress your images to reduce file size while maintaining visual quality. Perfect for web optimization and faster loading times.
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
                    <p className="text-sm text-muted-foreground">Compress multiple images at once</p>
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
