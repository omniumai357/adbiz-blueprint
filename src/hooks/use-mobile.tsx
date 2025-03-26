
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [hasTouchCapability, setHasTouchCapability] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check for touch capability once
    setHasTouchCapability('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    // Monitor viewport width
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Initial check
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Consider a device to be mobile if it either has a small screen OR has touch capabilities
  // This handles tablets and other touch devices better
  return !!isMobile || hasTouchCapability
}

// Specialized version that's more strict about what counts as mobile
export function useIsMobileViewport() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Initial check
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
