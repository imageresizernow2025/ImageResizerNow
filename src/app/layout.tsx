
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ImageStoreProvider } from "@/store/image-store";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { PageTrackerComponent } from "@/components/PageTracker";

export const metadata: Metadata = {
  title: "ImageResizerNow | Resize, Compress & Convert Images Online FREE",
  description: "Resize images instantly with ImageResizerNow — free online tool to resize, compress, and convert images in seconds. No software needed!",
  keywords: "image resizer, resize image, image compressor, image converter, crop image, bulk image resizer, instagram resizer, facebook resizer, youtube thumbnail resizer",
  authors: [{ name: "ImageResizerNow" }],
  openGraph: {
    title: "ImageResizerNow | Resize, Compress & Convert Images Online FREE",
    description: "Free browser-based image resizer, compressor, and converter. Fast and easy to use.",
    url: "https://imageresizernow.com",
    siteName: 'ImageResizerNow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ImageResizerNow | Resize, Compress & Convert Images Online FREE",
    description: "Free browser-based image resizer, compressor, and converter. Fast and easy to use.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 12H3M21 12l-4 4M21 12l-4-4M12 3v18M12 3l4 4M12 3L8 7' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ImageResizerNow",
            "url": "https://imageresizernow.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://imageresizernow.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ImageResizerNow",
            "operatingSystem": "Web Browser",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Bulk Image Resizer",
              "Image Compressor",
              "Image Converter",
              "Crop Image",
              "Instagram Resizer",
              "Facebook Resizer",
              "Twitter Resizer",
              "YouTube Thumbnail Resizer"
            ]
          }) }}
        />
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1125405879614984"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <AuthProvider>
          <AdminAuthProvider>
            <ImageStoreProvider>
              <PageTrackerComponent />
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ImageStoreProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
