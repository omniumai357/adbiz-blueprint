
import { useState, useEffect } from 'react';
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";

/**
 * ViewMode types for tour display
 */
export type TourViewMode = 'tooltip' | 'drawer' | 'compact' | 'sheet';

/**
 * Hook that manages responsive tour layout decisions
 * 
 * This hook handles view selection based on device type, screen orientation,
 * and user preferences, with smooth transitions between states.
 */
export function useTourResponsiveLayout() {
  const {
    isMobile,
    isTablet,
    isLandscape,
    isPortrait,
    preferredViewMode,
    isOrientationChanging,
    screenWidth,
    screenHeight
  } = useResponsiveTour();
  
  const [viewMode, setViewMode] = useState<TourViewMode>('tooltip');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('vertical');
  
  // Update layout direction based on screen dimensions
  useEffect(() => {
    const newDirection = isLandscape ? 'horizontal' : 'vertical';
    setLayoutDirection(newDirection);
  }, [isLandscape, screenWidth, screenHeight]);
  
  // Update view mode when device or orientation changes
  useEffect(() => {
    // During orientation changes, prevent view switching
    if (isOrientationChanging) {
      setIsTransitioning(true);
      return;
    }
    
    // Handle explicit user preference
    if (preferredViewMode !== 'fullscreen') {
      setViewMode(preferredViewMode as TourViewMode);
      setIsTransitioning(false);
      return;
    }
    
    // Auto-select best view mode based on device and orientation
    let newViewMode: TourViewMode = 'tooltip';
    
    if (isMobile) {
      // Mobile in portrait: sheet, in landscape: compact
      newViewMode = isPortrait ? 'sheet' : 'compact';
    } else if (isTablet) {
      // Tablet in portrait: drawer, in landscape: tooltip
      newViewMode = isPortrait ? 'drawer' : 'tooltip';
    } else {
      // Desktop always uses tooltip
      newViewMode = 'tooltip';
    }
    
    setViewMode(newViewMode);
    setIsTransitioning(false);
  }, [isMobile, isTablet, isLandscape, isPortrait, preferredViewMode, isOrientationChanging]);
  
  // Get appropriate container classes based on view mode
  const getContainerClasses = () => {
    const baseClasses = 'tour-container';
    
    switch (viewMode) {
      case 'tooltip':
        return `${baseClasses} tour-tooltip-container`;
      case 'drawer':
        return `${baseClasses} tour-drawer-container`;
      case 'compact':
        return `${baseClasses} tour-compact-container`;
      case 'sheet':
        return `${baseClasses} tour-sheet-container`;
      default:
        return baseClasses;
    }
  };
  
  // Get content classes based on layout direction
  const getContentClasses = () => {
    const baseClasses = 'tour-content';
    return layoutDirection === 'horizontal' 
      ? `${baseClasses} tour-content-horizontal` 
      : `${baseClasses} tour-content-vertical`;
  };
  
  return {
    viewMode,
    isTransitioning,
    layoutDirection,
    containerClasses: getContainerClasses(),
    contentClasses: getContentClasses(),
    
    // Helper methods to check view types
    isTooltipView: viewMode === 'tooltip',
    isDrawerView: viewMode === 'drawer',
    isCompactView: viewMode === 'compact',
    isSheetView: viewMode === 'sheet',
    isMobileView: viewMode === 'compact' || viewMode === 'sheet'
  };
}
