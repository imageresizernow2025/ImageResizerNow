import Script from 'next/script';

interface StructuredDataLayoutProps {
  children: React.ReactNode;
  structuredData: any[];
}

export function StructuredDataLayout({ children, structuredData }: StructuredDataLayoutProps) {
  return (
    <>
      {structuredData.map((data, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {children}
    </>
  );
}
