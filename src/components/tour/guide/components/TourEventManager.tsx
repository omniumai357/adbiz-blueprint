
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";
import { logger } from "@/lib/utils/logging";

/**
 * TourEventManager Component
 * 
 * Manages global event listeners for the tour, such as:
 * - Window resize events
 * - Scroll events
 * - History navigation events
 * - Orientation changes
 */
export const TourEventManager: React.FC = () => {
  const { isActive, endTour, currentStepData } = useTour();
  const { handleOrientationChange, isOrientationChanging } = useResponsiveTour();
  
  // Handle browser navigation (back button)
  useEffect(() => {
    if (!isActive) return;
    
    const handlePopState = () => {
      // End tour if user navigates with browser controls
      endTour();
      logger.debug('Tour ended due to browser navigation', {
        context: 'TourEventManager'
      });
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive, endTour]);
  
  // Handle scroll events
  useEffect(() => {
    if (!isActive) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        logger.debug('Tour scroll event handled', {
          context: 'TourEventManager',
          data: {
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            currentStep: currentStepData?.id
          }
        });
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isActive, currentStepData]);
  
  // Handle orientation changes
  useEffect(() => {
    if (!isActive) return;
    
    // Watch for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isActive, handleOrientationChange]);
  
  // Handle orientation change completion
  useEffect(() => {
    if (isOrientationChanging) {
      logger.debug('Handling orientation change in tour events', {
        context: 'TourEventManager',
        data: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }
  }, [isOrientationChanging]);
  
  // This component doesn't render anything visible
  // It just adds event listeners through hooks and effects
  return null;
};
