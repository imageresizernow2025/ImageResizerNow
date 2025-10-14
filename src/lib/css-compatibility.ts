/**
 * CSS Compatibility Utilities
 * 
 * This utility provides CSS classes and functions to ensure
 * cross-browser compatibility for modern CSS properties.
 */

export const cssCompatibilityClasses = {
  // Text size adjustment
  textSizeAdjust: 'text-size-adjust-fix',
  
  // Backdrop filter
  backdropFilter: 'backdrop-filter-fix',
  
  // Mask image
  maskImage: 'mask-image-fix',
  
  // User select
  userSelect: 'user-select-fix',
} as const;

/**
 * Apply CSS compatibility fixes to elements
 */
export function applyCompatibilityFixes(element: HTMLElement) {
  if (typeof window === 'undefined') return;

  // Fix text-size-adjust
  element.style.setProperty('-webkit-text-size-adjust', '100%');
  element.style.setProperty('text-size-adjust', '100%');
  
  // Fix backdrop-filter
  if (element.style.backdropFilter || element.style.webkitBackdropFilter) {
    element.style.setProperty('-webkit-backdrop-filter', element.style.backdropFilter || 'blur(10px)');
  }
  
  // Fix mask-image
  if (element.style.maskImage || element.style.webkitMaskImage) {
    element.style.setProperty('-webkit-mask-image', element.style.maskImage || 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 10%)');
  }
  
  // Fix user-select
  if (element.style.userSelect === 'none') {
    element.style.setProperty('-webkit-user-select', 'none');
    element.style.setProperty('-moz-user-select', 'none');
    element.style.setProperty('-ms-user-select', 'none');
  }
}

/**
 * Initialize global CSS compatibility fixes
 */
export function initializeCSSCompatibility() {
  if (typeof window === 'undefined') return;

  // Add global styles for common compatibility issues
  const style = document.createElement('style');
  style.textContent = `
    /* Global CSS compatibility fixes */
    html {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    
    /* Fix for Next.js dialog backdrop */
    [data-nextjs-dialog-backdrop] {
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    
    /* Fix for Next.js container errors */
    [data-nextjs-container-errors-pseudo-html-collapse='true'] .nextjs__container_errors__component-stack code {
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 10%);
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 10%);
    }
    
    /* Fix for dev tools indicator */
    .dev-tools-indicator-item {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `;
  
  document.head.appendChild(style);
}
