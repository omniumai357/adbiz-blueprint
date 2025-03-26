
import * as React from "react"
import { useMediaQuery } from "./use-media-query"

// Device breakpoints in pixels
const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 768,  // md
  desktop: 1024, // lg
  large: 1280   // xl
}

/**
 * Enhanced hook for device type detection with capabilities
 * 
 * @returns Object with device type and capability flags
 */
export function useDevice() {
  const [devicePixelRatio, setDevicePixelRatio] = React.useState<number>(1)
  const [hasTouchCapability, setHasTouchCapability] = React.useState<boolean>(false)
  
  // Use media queries for responsive breakpoint detection
  const isMobileScreen = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
  const isTabletScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`)
  const isDesktopScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`)
  const isLargeScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.large}px)`)
  const isPortrait = useMediaQuery("(orientation: portrait)")
  
  React.useEffect(() => {
    // Detect touch capability
    setHasTouchCapability('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    // Get device pixel ratio for high-DPI screens
    setDevicePixelRatio(window.devicePixelRatio || 1)
    
    // Handle changes to device pixel ratio (rare but possible)
    const handleChange = () => {
      setDevicePixelRatio(window.devicePixelRatio || 1)
    }
    
    // Media query for detecting changes to device pixel ratio
    try {
      const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } catch (err) {
      console.warn("Device pixel ratio monitoring not supported", err)
      return () => {}
    }
  }, [])
  
  // Calculate device type based on screen size AND touch capability
  const deviceType = React.useMemo(() => {
    // Tablets have larger screens but still use touch
    if (isTabletScreen || (isDesktopScreen && hasTouchCapability && !isLargeScreen)) {
      return "tablet"
    }
    
    // Phones and small touch devices
    if (isMobileScreen || (!isDesktopScreen && hasTouchCapability)) {
      return "mobile"
    }
    
    // Default to desktop for everything else
    return "desktop"
  }, [isMobileScreen, isTabletScreen, isDesktopScreen, isLargeScreen, hasTouchCapability])
  
  // Device capabilities
  const capabilities = React.useMemo(() => ({
    touch: hasTouchCapability,
    highDPI: devicePixelRatio >= 2,
    ultraHighDPI: devicePixelRatio >= 3,
    portrait: isPortrait,
    landscape: !isPortrait
  }), [hasTouchCapability, devicePixelRatio, isPortrait])
  
  return {
    // Device type
    deviceType,
    isTablet: deviceType === "tablet",
    isMobile: deviceType === "mobile" || deviceType === "tablet", // For backward compatibility
    isMobileOnly: deviceType === "mobile",
    isDesktop: deviceType === "desktop",
    
    // Screen size (regardless of device type)
    isMobileScreen,
    isTabletScreen, 
    isDesktopScreen,
    isLargeScreen,
    
    // Orientation
    isPortrait,
    isLandscape: !isPortrait,
    
    // Capabilities
    ...capabilities,
    
    // Raw values for custom logic
    devicePixelRatio,
    hasTouchCapability
  }
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDevice() instead
 */
export function useIsMobile() {
  const { isMobile } = useDevice()
  return isMobile
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDevice() instead
 */
export function useIsMobileViewport() {
  const { isMobileScreen } = useDevice()
  return isMobileScreen
}
