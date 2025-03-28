
import { useState, useEffect } from 'react';
import { useDevice } from './use-device';

/**
 * Hook for responsive design decisions
 * Provides responsive variables and helper functions
 */
export function useResponsive() {
  const device = useDevice();
  
  return {
    // Screen orientation
    isPortrait: device.isPortrait,
    isLandscape: device.isLandscape,
    
    // Device types
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    
    // Screen dimensions
    screenWidth: device.dimensions.width,
    screenHeight: device.dimensions.height,
    
    // High DPI detection
    isHighDPI: device.highDPI,
    
    // Touch capability
    hasTouchCapability: device.hasTouchCapability
  };
}
