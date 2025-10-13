interface StructuredDataProps {
  type: 'howto' | 'software' | 'tool' | 'faq';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helper functions to generate structured data for each tool
export const generateHowToSchema = (toolName: string, toolUrl: string, steps: any[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": `How to Use ${toolName}`,
  "description": `Step-by-step guide to use ${toolName} for image processing`,
  "url": toolUrl,
  "image": "https://imageresizernow.com/og-image.jpg",
  "totalTime": "PT2M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "url": `${toolUrl}#step-${index + 1}`
  }))
});

export const generateSoftwareSchema = (toolName: string, toolUrl: string, features: string[]) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": toolName,
  "url": toolUrl,
  "description": `Free online ${toolName.toLowerCase()} tool for image processing`,
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "softwareVersion": "1.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "featureList": features,
  "screenshot": "https://imageresizernow.com/screenshot.jpg",
  "author": {
    "@type": "Organization",
    "name": "ImageResizerNow",
    "url": "https://imageresizernow.com"
  }
});

export const generateToolSchema = (toolName: string, toolUrl: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Tool",
  "name": toolName,
  "url": toolUrl,
  "description": description,
  "category": "Image Processing Tool",
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "ImageResizerNow",
    "url": "https://imageresizernow.com"
  }
});

export const generateFAQSchema = (toolName: string, toolUrl: string, faqs: any[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
