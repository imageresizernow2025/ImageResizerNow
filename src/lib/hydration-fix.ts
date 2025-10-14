/**
 * Hydration Fix Utility
 * 
 * This utility helps prevent hydration mismatches caused by browser extensions
 * like Dark Reader that modify the DOM after server rendering but before
 * React hydration.
 */

export function initializeHydrationFix() {
  if (typeof window === 'undefined') return;

  // Prevent hydration mismatches from browser extensions
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string) {
    const element = originalCreateElement.call(this, tagName);
    
    // Remove Dark Reader attributes that cause hydration mismatches
    if (element instanceof HTMLElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const target = mutation.target as HTMLElement;
            const attributeName = mutation.attributeName;
            
            // Remove Dark Reader attributes that cause hydration issues
            if (attributeName?.startsWith('data-darkreader-') || 
                attributeName === 'style' && target.hasAttribute('data-darkreader-inline-stroke')) {
              // Remove the problematic attributes
              if (attributeName?.startsWith('data-darkreader-')) {
                target.removeAttribute(attributeName);
              }
              
              // Clean up Dark Reader inline styles
              if (target.style && target.style.cssText.includes('--darkreader-inline')) {
                const cleanStyle = target.style.cssText
                  .split(';')
                  .filter(rule => !rule.includes('--darkreader-inline'))
                  .join(';');
                target.style.cssText = cleanStyle;
              }
            }
          }
        });
      });
      
      // Start observing the element for attribute changes
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['data-darkreader-inline-stroke', 'style']
      });
    }
    
    return element;
  };
}

/**
 * Suppress hydration warnings for elements that are commonly affected by browser extensions
 */
export function suppressHydrationWarnings() {
  if (typeof window === 'undefined') return;

  // Add a global flag to suppress hydration warnings for known problematic elements
  (window as any).__SUPPRESS_HYDRATION_WARNINGS__ = true;
}

/**
 * Clean up Dark Reader attributes from existing elements
 */
export function cleanupDarkReaderAttributes() {
  if (typeof window === 'undefined') return;

  // Remove Dark Reader attributes from all elements
  const elements = document.querySelectorAll('[data-darkreader-inline-stroke]');
  elements.forEach(element => {
    // Remove all Dark Reader attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-darkreader-')) {
        element.removeAttribute(attr.name);
      }
    });
    
    // Clean up Dark Reader inline styles
    if (element instanceof HTMLElement && element.style) {
      const cleanStyle = element.style.cssText
        .split(';')
        .filter(rule => !rule.includes('--darkreader-inline'))
        .join(';');
      element.style.cssText = cleanStyle;
    }
  });
}

/**
 * Initialize all hydration fixes
 */
export function initializeAllHydrationFixes() {
  initializeHydrationFix();
  suppressHydrationWarnings();
  
  // Clean up existing Dark Reader attributes after a short delay
  // to allow browser extensions to finish their modifications
  setTimeout(cleanupDarkReaderAttributes, 100);
}
