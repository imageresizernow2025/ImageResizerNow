'use client';

import { useEffect, useRef } from 'react';

interface HydrationSafeProps {
  children: React.ReactNode;
  className?: string;
  suppressHydrationWarning?: boolean;
}

/**
 * HydrationSafe component
 * 
 * This component helps prevent hydration mismatches caused by browser extensions
 * like Dark Reader by cleaning up problematic attributes and styles.
 */
export function HydrationSafe({ 
  children, 
  className = '', 
  suppressHydrationWarning = true 
}: HydrationSafeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Lightweight cleanup function
    const cleanupDarkReaderAttributes = () => {
      const element = ref.current;
      if (!element) return;

      // Only clean up if Dark Reader attributes are present
      const darkReaderElements = element.querySelectorAll('[data-darkreader-inline-stroke]');
      if (darkReaderElements.length > 0) {
        darkReaderElements.forEach(child => {
          child.removeAttribute('data-darkreader-inline-stroke');
          
          if (child instanceof HTMLElement && child.style.cssText.includes('--darkreader-inline')) {
            child.style.cssText = child.style.cssText
              .split(';')
              .filter(rule => !rule.includes('--darkreader-inline'))
              .join(';');
          }
        });
      }
    };

    // Clean up once after a short delay
    const timeoutId = setTimeout(cleanupDarkReaderAttributes, 100);

    // Set up a lightweight mutation observer
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
      // Debounce to avoid performance issues
      clearTimeout(observerTimeout);
      observerTimeout = setTimeout(() => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName?.startsWith('data-darkreader-')) {
            mutation.target.removeAttribute(mutation.attributeName);
          }
        });
      }, 50);
    });

    observer.observe(element, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-darkreader-inline-stroke']
    });

    // Clean up on unmount
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeout);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`dark-reader-safe ${className}`}
      data-suppress-hydration-warning={suppressHydrationWarning}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {children}
    </div>
  );
}
