
import { useState, useEffect, useCallback } from 'react';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';
import { useMediaQuery } from '@/hooks/use-media-query';

type ViewMode = 'tooltip' | 'drawer' | 'compact' | 'fullscreen';

/**
 * Hook for managing responsive tour views and transitions
 */
export function useResponsiveTourViews() {
  const { 
    isMobile, 
    isTablet, 
    isLandscape, 
    preferredViewMode, 
    handleOrientationChange
  } = useResponsiveTour();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stableViewMode, setStableViewMode] = useState<ViewMode>(preferredViewMode);

  // Media queries for finer control
  const isSmallPhone = useMediaQuery('(max-width: 360px)');
  const isTallScreen = useMediaQuery('(min-height: 700px)');
  
  // Determine optimal view mode based on device and orientation
  const getOptimalViewMode = useCallback((): ViewMode => {
    if (isMobile) {
      if (isLandscape) {
        return isSmallPhone ? 'compact' : 'drawer';
      }
      return isTallScreen ? 'drawer' : 'compact';
    }
    
    if (isTablet) {
      return isLandscape ? 'tooltip' : 'drawer';
    }
    
    return 'tooltip';
  }, [isMobile, isTablet, isLandscape, isSmallPhone, isTallScreen]);
  
  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChangeEvent = () => {
      setIsTransitioning(true);
      handleOrientationChange();
      
      // After a delay, update the stable view mode and end transition
      setTimeout(() => {
        setStableViewMode(getOptimalViewMode());
        setIsTransitioning(false);
      }, 250);
    };
    
    window.addEventListener('orientationchange', handleOrientationChangeEvent);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChangeEvent);
    };
  }, [getOptimalViewMode, handleOrientationChange]);
  
  // Update stable view mode when preferred mode changes
  useEffect(() => {
    if (!isTransitioning) {
      setStableViewMode(preferredViewMode === 'fullscreen' ? getOptimalViewMode() : preferredViewMode);
    }
  }, [preferredViewMode, getOptimalViewMode, isTransitioning]);
  
  const shouldUseDrawer = useCallback(() => {
    return stableViewMode === 'drawer' || 
           (preferredViewMode === 'fullscreen' && (isMobile || (isTablet && !isLandscape)));
  }, [stableViewMode, preferredViewMode, isMobile, isTablet, isLandscape]);
  
  const shouldUseCompactView = useCallback(() => {
    return stableViewMode === 'compact' || 
           (preferredViewMode === 'fullscreen' && isMobile && isLandscape);
  }, [stableViewMode, preferredViewMode, isMobile, isLandscape]);
  
  return {
    viewMode: stableViewMode,
    isTransitioning,
    shouldUseDrawer,
    shouldUseCompactView,
    getOptimalViewMode
  };
}
