
import { useRef, TouchEvent, useEffect, useState } from 'react';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';

interface TourGestureOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  preventDefaultOnSwipe?: boolean;
  preventScrollOnSwipe?: boolean;
  vibrate?: boolean;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

/**
 * Enhanced hook to handle touch gestures for tour navigation
 * with improved detection and feedback mechanisms
 * 
 * @param options Gesture configuration options
 * @returns Touch event handlers for React components
 */
export function useTourGestures({
  threshold,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  onLongPress,
  preventDefaultOnSwipe = false,
  preventScrollOnSwipe = false,
  vibrate = false,
  longPressDelay = 500,
  doubleTapDelay = 300
}: TourGestureOptions = {}) {
  // Get responsive context
  const { isMobile, isTablet, isRTL } = useResponsiveTour();
  
  // Automatically adjust threshold based on device type
  const defaultThreshold = isMobile ? 40 : isTablet ? 50 : 60;
  const actualThreshold = threshold || defaultThreshold;
  
  // Touch tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const touchMoved = useRef<boolean>(false);
  const touchStartTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Direction lock helps prevent diagonal swipes from triggering both horizontal and vertical actions
  const [directionLock, setDirectionLock] = useState<'horizontal' | 'vertical' | null>(null);
  
  // Cleanup function for long press timer
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);
  
  const handleTouchStart = (e: TouchEvent) => {
    // Get touch coordinates
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
    touchStartTime.current = Date.now();
    
    // Reset direction lock
    setDirectionLock(null);
    
    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (
          touchStartX.current !== null && 
          touchStartY.current !== null && 
          !touchMoved.current
        ) {
          // Trigger haptic feedback if enabled
          if (vibrate && navigator.vibrate) {
            navigator.vibrate(50);
          }
          
          onLongPress(touchStartX.current, touchStartY.current);
        }
      }, longPressDelay);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // Calculate distance moved
    const diffX = Math.abs((touchStartX.current || 0) - (touchEndX.current || 0));
    const diffY = Math.abs((touchStartY.current || 0) - (touchEndY.current || 0));
    
    // Determine direction if we haven't locked it yet
    if (!directionLock && (diffX > 10 || diffY > 10)) {
      setDirectionLock(diffX > diffY ? 'horizontal' : 'vertical');
    }
    
    // If we've moved enough to consider it a swipe
    if (diffX > actualThreshold || diffY > actualThreshold) {
      touchMoved.current = true;
      
      // Clear long press timer since we're moving
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      // If configured to prevent default (e.g., to prevent page scrolling during swipe)
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      // Prevent scrolling during horizontal swipes if requested
      if (preventScrollOnSwipe && directionLock === 'horizontal') {
        e.preventDefault();
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (!touchStartX.current || !touchEndX.current || 
        !touchStartY.current || !touchEndY.current) {
      return;
    }
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime.current;
    
    // Calculate distances
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    
    // For RTL layouts, invert the horizontal direction
    const adjustedDiffX = isRTL ? -diffX : diffX;
    
    // Determine if the gesture was a swipe or a tap
    if (touchMoved.current) {
      // Only handle swiping in the direction we've locked to (or both if no lock)
      if (directionLock === 'horizontal' || !directionLock) {
        if (adjustedDiffX > actualThreshold && onSwipeLeft) {
          // Swiped left
          if (vibrate && navigator.vibrate) {
            navigator.vibrate(20);
          }
          onSwipeLeft();
        } else if (adjustedDiffX < -actualThreshold && onSwipeRight) {
          // Swiped right
          if (vibrate && navigator.vibrate) {
            navigator.vibrate(20);
          }
          onSwipeRight();
        }
      }
      
      if (directionLock === 'vertical' || !directionLock) {
        if (diffY > actualThreshold && onSwipeUp) {
          // Swiped up
          if (vibrate && navigator.vibrate) {
            navigator.vibrate(20);
          }
          onSwipeUp();
        } else if (diffY < -actualThreshold && onSwipeDown) {
          // Swiped down
          if (vibrate && navigator.vibrate) {
            navigator.vibrate(20);
          }
          onSwipeDown();
        }
      }
    } else if (touchDuration < 300) {
      // It was a tap (only if short duration and minimal movement)
      const maxMoveForTap = 10;
      if (Math.abs(diffX) < maxMoveForTap && Math.abs(diffY) < maxMoveForTap) {
        const now = Date.now();
        
        // Check for double tap
        if (onDoubleTap && (now - lastTapTime.current) < doubleTapDelay) {
          if (vibrate && navigator.vibrate) {
            navigator.vibrate([20, 50, 20]);
          }
          onDoubleTap(touchEndX.current, touchEndY.current);
          lastTapTime.current = 0; // Reset to prevent triple-tap detection
        } else {
          // Single tap
          if (onTap) {
            if (vibrate && navigator.vibrate) {
              navigator.vibrate(10);
            }
            onTap(touchEndX.current, touchEndY.current);
          }
          lastTapTime.current = now;
        }
      }
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
    touchMoved.current = false;
    setDirectionLock(null);
  };
  
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
}
