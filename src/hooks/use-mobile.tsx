import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        if (typeof window !== 'undefined') {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
      }
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return () => mql.removeEventListener("change", onChange)
    } catch (error) {
      console.error('Error in useIsMobile hook:', error);
      // Fallback to false if there's an error
      setIsMobile(false);
    }
  }, [])

  return !!isMobile
}
