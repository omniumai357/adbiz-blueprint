
import React, { createContext, useContext, useMemo } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLanguage } from '@/contexts/language-context';

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
  getOptimalPosition: (elementRect: DOMRect | null) => 'top' | 'right' | 'bottom' | 'left';
}

// Create the context with a default value
const ResponsiveTourContext = createContext<ResponsiveTourContextType | undefined>(undefined);

interface ResponsiveTourProviderProps {
  children: React.ReactNode;
}

export const ResponsiveTourProvider: React.FC<ResponsiveTourProviderProps> = ({ children }) => {
  // Use our existing responsive hook
  const responsive = useResponsive();
  
  // Get language direction settings
  const { isRTL, direction } = useLanguage();
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Determine the preferred view mode based on device
  const preferredViewMode = useMemo((): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    if (responsive.isMobile) {
      return responsive.isLandscape ? 'compact' : 'drawer';
    } else if (responsive.isTablet) {
      return responsive.isLandscape ? 'tooltip' : 'drawer';
    } else {
      return 'tooltip';
    }
  }, [responsive.isMobile, responsive.isTablet, responsive.isLandscape]);
  
  // Helper function to get optimal view for current device
  const getViewForDevice = (): 'tooltip' | 'drawer' | 'compact' | 'fullscreen' => {
    if (window.innerWidth < 480) return 'fullscreen';
    if (window.innerWidth < 768) return 'drawer';
    if (window.innerHeight < 500) return 'compact';
    if (responsive.isTablet && !responsive.isLandscape) return 'drawer';
    return 'tooltip';
  };
  
  // Helper function to determine optimal position for tooltips
  const getOptimalPosition = (elementRect: DOMRect | null): 'top' | 'right' | 'bottom' | 'left' => {
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
    return spaces[0].direction as 'top' | 'right' | 'bottom' | 'left';
  };
  
  // Define the context value
  const contextValue = useMemo(() => ({
    // Device detection
    isMobile: responsive.isMobile,
    isTablet: responsive.isTablet,
    isDesktop: responsive.isDesktop,
    isLandscape: responsive.isLandscape,
    isPortrait: responsive.isPortrait,
    
    // Screen size
    activeBreakpoint: responsive.activeBreakpoint,
    
    // View preferences
    preferredViewMode,
    
    // Layout preferences
    minTouchTargetSize: 44, // Minimum touch target size in pixels
    contentMaxWidth: responsive.isMobile ? 320 : responsive.isTablet ? 480 : 600,
    
    // RTL support
    isRTL,
    direction,
    
    // Accessibility
    prefersReducedMotion,
    
    // Helper functions
    getViewForDevice,
    getOptimalPosition
  }), [
    responsive.isMobile, responsive.isTablet, responsive.isDesktop, 
    responsive.isLandscape, responsive.isPortrait, responsive.activeBreakpoint,
    preferredViewMode, isRTL, direction, prefersReducedMotion
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
