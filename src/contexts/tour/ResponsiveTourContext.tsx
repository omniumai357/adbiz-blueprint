
import React, { createContext, useContext, useMemo } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLanguage } from '@/contexts/language-context';
import { useDevice } from '@/hooks/use-device';
import { Position } from '@/lib/tour/types';

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
  
  // Determine the preferred view mode based on device
  const preferredViewMode = useMemo((): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    if (device.isMobile) {
      return device.isLandscape ? 'compact' : 'drawer';
    } else if (device.isTablet) {
      return device.isLandscape ? 'tooltip' : 'drawer';
    } else {
      return 'tooltip';
    }
  }, [device.isMobile, device.isTablet, device.isLandscape]);
  
  // Helper function to get optimal view for current device
  const getViewForDevice = (): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    if (device.dimensions.width < 480) return 'fullscreen';
    if (device.dimensions.width < 768) return 'drawer';
    if (device.dimensions.height < 500) return 'compact';
    if (device.isTablet && !device.isLandscape) return 'drawer';
    return 'tooltip';
  };
  
  // Helper function to determine if drawer should be used
  const shouldUseDrawer = (): boolean => {
    return device.isMobile || 
          (device.isTablet && !device.isLandscape) || 
          device.dimensions.width < 768;
  };
  
  // Helper function to determine if compact view should be used
  const shouldUseCompactView = (): boolean => {
    return (device.isMobile && device.isLandscape) || 
           device.dimensions.height < 500;
  };

  // Helper function to determine optimal position for tooltips
  const getOptimalPosition = (elementRect: DOMRect | null): Position => {
    if (!elementRect) return 'bottom';
    
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
    
    // Return the direction with the most space
    return spaces[0].direction as Position;
  };
  
  // Define the context value
  const contextValue = useMemo(() => ({
    // Device detection
    isMobile: device.isMobile,
    isTablet: device.isTablet,
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
    contentMaxWidth: device.isMobile ? 320 : device.isTablet ? 480 : 600,
    
    // RTL support
    isRTL,
    direction,
    
    // Accessibility
    prefersReducedMotion,
    
    // Helper functions
    getViewForDevice,
    getOptimalPosition,
    shouldUseDrawer,
    shouldUseCompactView
  }), [
    device.isMobile, device.isTablet, device.isDesktop, 
    device.isLandscape, device.isPortrait, device.dimensions,
    responsive.activeBreakpoint, preferredViewMode, 
    isRTL, direction, prefersReducedMotion
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
