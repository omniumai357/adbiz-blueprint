
import { useCallback, useEffect, useState } from "react";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";

/**
 * Hook that manages tour view modes based on device and orientation
 */
export function useResponsiveTourViews() {
  const {
    isMobile,
    isTablet,
    isLandscape,
    preferredViewMode,
    isOrientationChanging
  } = useResponsiveTour();
  
  const [viewMode, setViewMode] = useState<"tooltip" | "drawer" | "compact" | "bottomSheet">("tooltip");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Update view mode when device or orientation changes
  useEffect(() => {
    // During transitions, don't change view type to prevent flickering
    if (isOrientationChanging) {
      setIsTransitioning(true);
      return;
    }
    
    // Handle explicit preference
    if (preferredViewMode !== "fullscreen") {
      setViewMode(preferredViewMode);
      setIsTransitioning(false);
      return;
    }
    
    // Auto-detect best view based on device and orientation
    let newMode: "tooltip" | "drawer" | "compact" | "bottomSheet" = "tooltip";
    
    if (isMobile) {
      // Mobile phone in landscape = compact view
      // Mobile phone in portrait = bottom sheet
      newMode = isLandscape ? "compact" : "bottomSheet";
    } else if (isTablet) {
      // Tablet in landscape = tooltip
      // Tablet in portrait = drawer
      newMode = isLandscape ? "tooltip" : "drawer";
    } else {
      // Desktop always uses tooltip
      newMode = "tooltip";
    }
    
    setViewMode(newMode);
    setIsTransitioning(false);
  }, [isMobile, isTablet, isLandscape, preferredViewMode, isOrientationChanging]);
  
  // Helper functions to check which view should be used
  const shouldUseDrawer = useCallback(() => {
    return viewMode === "drawer" || 
           (isTablet && !isLandscape && preferredViewMode === "fullscreen");
  }, [viewMode, isTablet, isLandscape, preferredViewMode]);
  
  const shouldUseCompactView = useCallback(() => {
    return viewMode === "compact" || 
           (isMobile && isLandscape && preferredViewMode === "fullscreen");
  }, [viewMode, isMobile, isLandscape, preferredViewMode]);
  
  const shouldUseBottomSheet = useCallback(() => {
    return viewMode === "bottomSheet" || 
           (isMobile && !isLandscape && preferredViewMode === "fullscreen");
  }, [viewMode, isMobile, isLandscape, preferredViewMode]);
  
  const shouldUseTooltip = useCallback(() => {
    return viewMode === "tooltip" || 
           (isTablet && isLandscape && preferredViewMode === "fullscreen") ||
           (!isMobile && !isTablet);
  }, [viewMode, isTablet, isMobile, isLandscape, preferredViewMode]);
  
  return {
    viewMode,
    isTransitioning,
    shouldUseDrawer,
    shouldUseCompactView,
    shouldUseBottomSheet,
    shouldUseTooltip
  };
}
