
import { useState, useEffect, useCallback } from 'react';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';

/**
 * Touch event boundary protection distance in pixels
 */
const EDGE_PROTECTION_PX = 48;

/**
 * Hook to handle mobile-specific tour interactions
 * 
 * Provides gesture support, touch optimization, and
 * accessibility enhancements for mobile tour experiences.
 */
export function useMobileTourInteractions() {
  const {
    isMobile,
    isTablet,
    screenWidth,
    screenHeight,
    minTouchTargetSize,
    isRTL,
    direction
  } = useResponsiveTour();
  
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  
  // Detect if device has touch capability
  const hasTouchCapability = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  // Handle touch start events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile && !isTablet) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsSwiping(true);
  }, [isMobile, isTablet]);
  
  // Handle touch move events
  const handleTouchMove = useCallback((
    e: React.TouchEvent, 
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void
  ) => {
    if (!isSwiping) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    // Ignore vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }
    
    // Prevent edge swipes (device gestures)
    if (touch.clientX < EDGE_PROTECTION_PX || touch.clientX > screenWidth - EDGE_PROTECTION_PX) {
      return;
    }
    
    // Required minimum distance for a swipe
    const MIN_SWIPE_DISTANCE = 50;
    
    // Handle horizontal swipes based on RTL setting
    if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
      if (isRTL) {
        // In RTL mode, swipe directions are reversed
        if (deltaX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      } else {
        // Standard LTR handling
        if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
      
      setIsSwiping(false);
    }
  }, [isSwiping, startX, startY, screenWidth, isRTL]);
  
  // Handle touch end events
  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
  }, []);
  
  // Calculate optimal touch areas
  const getTouchSizeStyles = () => {
    return {
      minWidth: `${minTouchTargetSize}px`,
      minHeight: `${minTouchTargetSize}px`,
      padding: `${Math.max(8, minTouchTargetSize / 4)}px`
    };
  };
  
  return {
    // Touch event handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Touch optimization
    hasTouchCapability,
    touchSizeStyles: getTouchSizeStyles(),
    
    // Direction awareness
    isRTL,
    direction
  };
}
