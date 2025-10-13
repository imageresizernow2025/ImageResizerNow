
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
import { GoogleCMP } from "@/components/GoogleCMP";
import { AMPAutoAds } from "@/components/ads/AMPAutoAds";

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
        {/* Fixed favicon - no more SVG syntax errors */}
        <link rel="icon" href="/favicon.ico" />
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
        <meta name="google-adsense-account" content="ca-pub-1125405879614984" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1125405879614984"
          crossOrigin="anonymous"
        />
        
        {/* AMP Auto Ads */}
        <script 
          async 
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        />
        
        {/* Google CMP for GDPR Compliance */}
        <script 
          async 
          src="https://fundingchoicesmessages.google.com/i/pub-1125405879614984?ers=1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function signalGooglefcPresent() {
                  if (!window.frames['googlefcPresent']) {
                    if (document.body) {
                      const iframe = document.createElement('iframe');
                      iframe.style.width = '0';
                      iframe.style.height = '0';
                      iframe.style.border = 'none';
                      iframe.style.zIndex = '-1000';
                      iframe.style.left = '-1000px';
                      iframe.style.top = '-1000px';
                      iframe.name = 'googlefcPresent';
                      document.body.appendChild(iframe);
                    } else {
                      setTimeout(signalGooglefcPresent, 0);
                    }
                  }
                }
                signalGooglefcPresent();
              })();
            `,
          }}
        />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        {/* AMP Auto Ads for all pages */}
        <AMPAutoAds />
        
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
              <GoogleCMP />
            </ImageStoreProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
