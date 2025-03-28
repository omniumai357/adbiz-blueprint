
import React, { createContext, useContext, useMemo, useEffect, useCallback, useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLanguage } from '@/contexts/language-context';
import { useDevice } from '@/hooks/use-device';
import { Position } from '@/lib/tour/types';
import { logger } from '@/lib/utils/logging';

// Define the context type
export interface ResponsiveTourContextType {
  // Device detection
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Screen size
  activeBreakpoint: string;
  screenWidth: number;
  screenHeight: number;
  
  // View preferences based on device
  preferredViewMode: 'tooltip' | 'drawer' | 'compact' | 'fullscreen';
  
  // Layout preferences
  minTouchTargetSize: number;
  contentMaxWidth: number;
  
  // RTL support
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  
  // Accessibility
  prefersReducedMotion: boolean;
  
  // Helper functions
  getViewForDevice: () => 'tooltip' | 'drawer' | 'compact' | 'fullscreen';
  getOptimalPosition: (elementRect: DOMRect | null) => Position;
  shouldUseDrawer: () => boolean;
  shouldUseCompactView: () => boolean;
  
  // Orientation change detection
  isOrientationChanging: boolean;
  handleOrientationChange: () => void;
}

// Create the context with a default value
const ResponsiveTourContext = createContext<ResponsiveTourContextType | undefined>(undefined);

interface ResponsiveTourProviderProps {
  children: React.ReactNode;
}

export const ResponsiveTourProvider: React.FC<ResponsiveTourProviderProps> = ({ children }) => {
  // Use our existing responsive hooks
  const responsive = useResponsive();
  const device = useDevice();
  
  // Get language direction settings
  const { isRTL, direction } = useLanguage();
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Track orientation changes
  const [isOrientationChanging, setIsOrientationChanging] = useState(false);
  
  // Enhanced device detection with fallbacks
  const isMobileEnhanced = useMemo(() => {
    // Primary check: use the device hook
    if (device.isMobile !== undefined) return device.isMobile;
    
    // Fallback: check screen dimensions
    return responsive.screenWidth < 640;
  }, [device.isMobile, responsive.screenWidth]);
  
  const isTabletEnhanced = useMemo(() => {
    // Primary check: use the device hook
    if (device.isTablet !== undefined) return device.isTablet;
    
    // Fallback: check screen dimensions
    return responsive.screenWidth >= 640 && responsive.screenWidth < 1024;
  }, [device.isTablet, responsive.screenWidth]);
  
  // Handle orientation changes
  const handleOrientationChange = useCallback(() => {
    if (!window) return;
    
    setIsOrientationChanging(true);
    
    // Allow a small delay for the browser to adjust layout
    setTimeout(() => {
      setIsOrientationChanging(false);
    }, 300);
    
    logger.debug('Orientation changed', {
      context: 'ResponsiveTourContext',
      data: {
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      }
    });
  }, []);
  
  // Add orientation change event listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also listen for resize events which could indicate orientation changes
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [handleOrientationChange]);
  
  // Determine the preferred view mode based on device and orientation
  const preferredViewMode = useMemo((): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    // Handle orientation change
    if (isOrientationChanging) {
      // Return current mode to avoid flickering during transition
      return 'drawer'; // Safe fallback during transitions
    }
    
    // Very small screens get fullscreen treatment
    if (device.dimensions.width < 320) {
      return 'fullscreen';
    }
    
    // Mobile phones
    if (isMobileEnhanced) {
      return device.isLandscape ? 'compact' : 'drawer';
    }
    
    // Tablets
    if (isTabletEnhanced) {
      return device.isLandscape ? 'tooltip' : 'drawer';
    }
    
    // Default for desktop
    return 'tooltip';
  }, [
    device.dimensions.width, 
    device.isLandscape, 
    isMobileEnhanced, 
    isTabletEnhanced, 
    isOrientationChanging
  ]);
  
  // Enhanced helper function to get optimal view for current device
  const getViewForDevice = useCallback((): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    if (!window) return 'tooltip'; // Safe server-side default
    
    const width = device.dimensions.width;
    const height = device.dimensions.height;
    const isLandscape = width > height;
    
    // Very small screens
    if (width < 320) return 'fullscreen';
    
    // Small phones
    if (width < 480) return isLandscape ? 'compact' : 'drawer';
    
    // Large phones
    if (width < 768) return isLandscape ? 'compact' : 'drawer';
    
    // Small tablets
    if (width < 1024) return isLandscape ? 'tooltip' : 'drawer';
    
    // Limited vertical space
    if (height < 500) return 'compact';
    
    // Default
    return 'tooltip';
  }, [device.dimensions]);
  
  // Helper function to determine if drawer should be used
  const shouldUseDrawer = useCallback((): boolean => {
    return preferredViewMode === 'drawer' || preferredViewMode === 'fullscreen';
  }, [preferredViewMode]);
  
  // Helper function to determine if compact view should be used
  const shouldUseCompactView = useCallback((): boolean => {
    return preferredViewMode === 'compact';
  }, [preferredViewMode]);

  // Helper function to determine optimal position for tooltips
  const getOptimalPosition = useCallback((elementRect: DOMRect | null): Position => {
    if (!elementRect || typeof window === 'undefined') return 'bottom';
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space in each direction
    const spaceAbove = elementRect.top;
    const spaceBelow = viewportHeight - (elementRect.top + elementRect.height);
    const spaceLeft = elementRect.left;
    const spaceRight = viewportWidth - (elementRect.left + elementRect.width);
    
    // Find the direction with the most space
    const spaces = [
      { direction: 'top', space: spaceAbove },
      { direction: 'right', space: spaceRight },
      { direction: 'bottom', space: spaceBelow },
      { direction: 'left', space: spaceLeft }
    ];
    
    // Sort by available space
    spaces.sort((a, b) => b.space - a.space);
    
    // Adjust for RTL languages
    if (isRTL) {
      if (spaces[0].direction === 'left') return 'right';
      if (spaces[0].direction === 'right') return 'left';
    }
    
    // Return the direction with the most space
    return spaces[0].direction as Position;
  }, [isRTL]);
  
  // Define the context value
  const contextValue = useMemo(() => ({
    // Device detection
    isMobile: isMobileEnhanced,
    isTablet: isTabletEnhanced,
    isDesktop: device.isDesktop,
    isLandscape: device.isLandscape,
    isPortrait: device.isPortrait,
    
    // Screen size
    activeBreakpoint: responsive.activeBreakpoint,
    screenWidth: device.dimensions.width,
    screenHeight: device.dimensions.height,
    
    // View preferences
    preferredViewMode,
    
    // Layout preferences
    minTouchTargetSize: 44, // Minimum touch target size in pixels
    contentMaxWidth: isMobileEnhanced ? 320 : isTabletEnhanced ? 480 : 600,
    
    // RTL support
    isRTL,
    direction,
    
    // Accessibility
    prefersReducedMotion,
    
    // Orientation change detection
    isOrientationChanging,
    handleOrientationChange,
    
    // Helper functions
    getViewForDevice,
    getOptimalPosition,
    shouldUseDrawer,
    shouldUseCompactView
  }), [
    isMobileEnhanced, 
    isTabletEnhanced, 
    device.isDesktop, 
    device.isLandscape, 
    device.isPortrait, 
    device.dimensions,
    responsive.activeBreakpoint, 
    preferredViewMode, 
    isRTL, 
    direction, 
    prefersReducedMotion,
    isOrientationChanging,
    handleOrientationChange,
    getViewForDevice,
    getOptimalPosition,
    shouldUseDrawer,
    shouldUseCompactView
  ]);
  
  // Provide the context to children
  return (
    <ResponsiveTourContext.Provider value={contextValue}>
      {children}
    </ResponsiveTourContext.Provider>
  );
};

// Custom hook to use the responsive tour context
export const useResponsiveTour = (): ResponsiveTourContextType => {
  const context = useContext(ResponsiveTourContext);
  
  if (!context) {
    throw new Error('useResponsiveTour must be used within a ResponsiveTourProvider');
  }
  
  return context;
};
