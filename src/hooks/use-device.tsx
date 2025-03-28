
import { useState, useEffect, useMemo } from "react";
import { logger } from "@/utils/logger";

// Device breakpoints in pixels - standardized across the application
export const DEVICE_BREAKPOINTS = {
  mobile: 640,    // Mobile devices (up to 640px)
  tablet: 1024,   // Tablets (up to 1024px)
  desktop: 1280,  // Desktop (up to 1280px)
  large: 1536     // Large screens (beyond 1536px)
};

interface DeviceDimensions {
  width: number;
  height: number;
}

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  
  isPortrait: boolean;
  isLandscape: boolean;
  
  hasTouchCapability: boolean;
  highDPI: boolean;
  
  dimensions: DeviceDimensions;
  pixelRatio: number;
}

/**
 * Hook that provides device information and capabilities
 * for responsive design decisions
 */
export function useDevice(): DeviceState {
  // Initialize with default values
  const [dimensions, setDimensions] = useState<DeviceDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });
  
  const [pixelRatio, setPixelRatio] = useState<number>(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  );
  
  const [hasTouchCapability, setHasTouchCapability] = useState<boolean>(
    typeof window !== 'undefined' ? 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 : 
      false
  );

  // Update dimensions on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      try {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
        setPixelRatio(window.devicePixelRatio || 1);
      } catch (err) {
        // Using a more compatible way to pass error information
        logger.error('Error updating device dimensions', { 
          context: 'useDevice',
          data: { errorMessage: String(err) }
        });
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Memoize derived device states to prevent unnecessary re-renders
  return useMemo(() => {
    const { width, height } = dimensions;
    
    // Device type detection
    const isMobile = width < DEVICE_BREAKPOINTS.mobile;
    const isTablet = width >= DEVICE_BREAKPOINTS.mobile && width < DEVICE_BREAKPOINTS.tablet;
    const isDesktop = width >= DEVICE_BREAKPOINTS.tablet && width < DEVICE_BREAKPOINTS.large;
    const isLargeDesktop = width >= DEVICE_BREAKPOINTS.large;
    
    // Orientation detection
    const isPortrait = height > width;
    const isLandscape = width >= height;
    
    // High DPI detection
    const highDPI = pixelRatio > 1;
    
    return {
      // Device types
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      
      // Orientation
      isPortrait,
      isLandscape,
      
      // Capabilities
      hasTouchCapability,
      highDPI,
      
      // Raw values
      dimensions,
      pixelRatio
    };
  }, [dimensions, pixelRatio, hasTouchCapability]);
}
