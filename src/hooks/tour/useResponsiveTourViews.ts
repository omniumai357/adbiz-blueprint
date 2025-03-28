
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * Available view modes for different device/orientation combinations
 */
export type TourViewMode = 'tooltip' | 'drawer' | 'compact' | 'fullscreen';

/**
 * The state of a responsive view transition
 */
export interface ResponsiveViewTransition {
  isTransitioning: boolean;
  previousViewMode: TourViewMode | null;
  currentViewMode: TourViewMode;
}

/**
 * Configuration options for responsive tour views
 */
export interface ResponsiveTourViewsOptions {
  /** Preferred view mode that can override automatic selection */
  preferredMode?: TourViewMode;
  /** Whether to use fullscreen mode on very small devices */
  enableFullscreenFallback?: boolean;
  /** Duration of view transitions in milliseconds */
  transitionDuration?: number;
}

/**
 * Hook for managing responsive tour views and transitions
 */
export function useResponsiveTourViews(options: ResponsiveTourViewsOptions = {}) {
  const { 
    isMobile, 
    isTablet, 
    isLandscape, 
    isPortrait,
    preferredViewMode, 
    handleOrientationChange,
    screenWidth,
    screenHeight
  } = useResponsiveTour();
  
  const {
    preferredMode = preferredViewMode,
    enableFullscreenFallback = true,
    transitionDuration = 250
  } = options;
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousViewMode, setPreviousViewMode] = useState<TourViewMode | null>(null);
  const [stableViewMode, setStableViewMode] = useState<TourViewMode>(preferredMode || 'tooltip');

  // Additional media queries for finer control
  const isSmallPhone = useMediaQuery('(max-width: 360px)');
  const isTallScreen = useMediaQuery('(min-height: 700px)');
  const hasLimitedHeight = useMediaQuery('(max-height: 500px)');
  
  // Determine optimal view mode based on device and orientation
  const getOptimalViewMode = useCallback((): TourViewMode => {
    // Very small screens always get compact view
    if (isSmallPhone && hasLimitedHeight) {
      return enableFullscreenFallback ? 'fullscreen' : 'compact';
    }
    
    if (isMobile) {
      if (isLandscape) {
        return 'compact';
      }
      return isTallScreen ? 'drawer' : 'compact';
    }
    
    if (isTablet) {
      return isLandscape ? 'tooltip' : 'drawer';
    }
    
    return 'tooltip';
  }, [
    isMobile, 
    isTablet, 
    isLandscape, 
    isSmallPhone, 
    isTallScreen, 
    hasLimitedHeight,
    enableFullscreenFallback
  ]);
  
  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChangeEvent = () => {
      setPreviousViewMode(stableViewMode);
      setIsTransitioning(true);
      handleOrientationChange();
      
      // After a delay, update the stable view mode and end transition
      setTimeout(() => {
        const newViewMode = getOptimalViewMode();
        setStableViewMode(newViewMode);
        setIsTransitioning(false);
      }, transitionDuration);
    };
    
    window.addEventListener('orientationchange', handleOrientationChangeEvent);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChangeEvent);
    };
  }, [getOptimalViewMode, handleOrientationChange, stableViewMode, transitionDuration]);
  
  // Update stable view mode when preferred mode changes
  useEffect(() => {
    if (!isTransitioning) {
      const newViewMode = preferredMode || getOptimalViewMode();
      
      if (newViewMode !== stableViewMode) {
        setPreviousViewMode(stableViewMode);
        setStableViewMode(newViewMode);
      }
    }
  }, [preferredMode, getOptimalViewMode, isTransitioning, stableViewMode]);
  
  // Helper functions for determining which view to use
  const shouldUseDrawer = useCallback(() => {
    return stableViewMode === 'drawer' || 
           (preferredMode === 'fullscreen' && (isMobile || (isTablet && !isLandscape)));
  }, [stableViewMode, preferredMode, isMobile, isTablet, isLandscape]);
  
  const shouldUseCompactView = useCallback(() => {
    return stableViewMode === 'compact' || 
           (preferredMode === 'fullscreen' && isMobile && isLandscape) ||
           hasLimitedHeight;
  }, [stableViewMode, preferredMode, isMobile, isLandscape, hasLimitedHeight]);
  
  const shouldUseFullscreen = useCallback(() => {
    return stableViewMode === 'fullscreen' || 
           (isSmallPhone && enableFullscreenFallback);
  }, [stableViewMode, isSmallPhone, enableFullscreenFallback]);
  
  // Device/orientation detection helpers
  const deviceInfo = useMemo(() => ({
    isMobile,
    isTablet,
    isLandscape,
    isPortrait,
    isSmallScreen: screenWidth < 640,
    isLargeScreen: screenWidth >= 1024,
    hasLimitedHeight: screenHeight < 500
  }), [isMobile, isTablet, isLandscape, isPortrait, screenWidth, screenHeight]);
  
  return {
    // Current view state
    viewMode: stableViewMode,
    previousViewMode,
    isTransitioning,
    transition: {
      isTransitioning,
      previousViewMode,
      currentViewMode: stableViewMode
    } as ResponsiveViewTransition,
    
    // Helper functions
    shouldUseDrawer,
    shouldUseCompactView,
    shouldUseFullscreen,
    getOptimalViewMode,
    
    // Device information
    deviceInfo,
    
    // Setter functions
    setPreferredViewMode: (mode: TourViewMode) => {
      setPreviousViewMode(stableViewMode);
      setStableViewMode(mode);
    }
  };
}
