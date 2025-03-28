import React, { useEffect, useRef } from "react";
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
 * - Touch gestures (for mobile)
 */
export const TourEventManager: React.FC = () => {
  const { isActive, endTour, currentStepData } = useTour();
  const { 
    handleOrientationChange, 
    isOrientationChanging,
    isMobile,
    isTablet
  } = useResponsiveTour();
  
  // Keep track of touch start position for swipe detection
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  
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
    
    // Enhanced orientation change handler for improved reliability
    const handleOrientationChangeEvent = () => {
      logger.debug('Orientation change detected', {
        context: 'TourEventManager',
        data: {
          width: window.innerWidth,
          height: window.innerHeight,
          orientation: window.orientation
        }
      });
      
      // Call the context's orientation change handler
      handleOrientationChange();
    };
    
    // Watch for both orientationchange and resize events for better cross-device support
    window.addEventListener('orientationchange', handleOrientationChangeEvent);
    
    // Also listen for resize events as a fallback for some devices
    const resizeHandler = () => {
      if (window.innerWidth !== window.outerWidth) {
        handleOrientationChangeEvent();
      }
    };
    
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChangeEvent);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isActive, handleOrientationChange]);
  
  // Handle touch events for mobile swipe navigation
  useEffect(() => {
    if (!isActive || (!isMobile && !isTablet)) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX.current - touchEndX;
      const diffY = touchStartY.current - touchEndY;
      
      // Only handle horizontal swipes if they're more horizontal than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        logger.debug('Tour swipe detected', {
          context: 'TourEventManager',
          data: { direction: diffX > 0 ? 'left' : 'right' }
        });
        
        // We'll implement the swipe navigation in a separate touch handler component
        // This just logs the swipe for now
      }
      
      // Reset touch start position
      touchStartX.current = null;
      touchStartY.current = null;
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, isMobile, isTablet]);
  
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
