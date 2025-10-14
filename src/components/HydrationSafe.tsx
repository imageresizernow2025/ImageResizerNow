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

    // Clean up Dark Reader attributes that cause hydration mismatches
    const cleanupDarkReaderAttributes = () => {
      const element = ref.current;
      if (!element) return;

      // Remove all Dark Reader attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-darkreader-')) {
          element.removeAttribute(attr.name);
        }
      });
      
      // Clean up Dark Reader inline styles
      if (element.style) {
        const cleanStyle = element.style.cssText
          .split(';')
          .filter(rule => !rule.includes('--darkreader-inline'))
          .join(';');
        element.style.cssText = cleanStyle;
      }

      // Clean up child elements
      const childElements = element.querySelectorAll('[data-darkreader-inline-stroke]');
      childElements.forEach(child => {
        Array.from(child.attributes).forEach(attr => {
          if (attr.name.startsWith('data-darkreader-')) {
            child.removeAttribute(attr.name);
          }
        });
        
        if (child instanceof HTMLElement && child.style) {
          const cleanStyle = child.style.cssText
            .split(';')
            .filter(rule => !rule.includes('--darkreader-inline'))
            .join(';');
          child.style.cssText = cleanStyle;
        }
      });
    };

    // Clean up immediately
    cleanupDarkReaderAttributes();

    // Set up a mutation observer to clean up new Dark Reader attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          const attributeName = mutation.attributeName;
          
          if (attributeName?.startsWith('data-darkreader-')) {
            target.removeAttribute(attributeName);
          }
          
          if (attributeName === 'style' && target instanceof HTMLElement) {
            const cleanStyle = target.style.cssText
              .split(';')
              .filter(rule => !rule.includes('--darkreader-inline'))
              .join(';');
            target.style.cssText = cleanStyle;
          }
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-darkreader-inline-stroke', 'style']
    });

    // Clean up observer on unmount
    return () => {
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
