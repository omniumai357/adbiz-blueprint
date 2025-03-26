
import { useRef, TouchEvent } from 'react';

interface TourGestureOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: (x: number, y: number) => void;
  preventDefaultOnSwipe?: boolean;
}

/**
 * Hook to handle touch gestures for tour navigation
 * 
 * @param options Gesture configuration options
 * @returns Touch event handlers for React components
 */
export function useTourGestures({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  preventDefaultOnSwipe = false
}: TourGestureOptions = {}) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const touchMoved = useRef<boolean>(false);
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // Check if we've moved enough to consider it a swipe
    const diffX = Math.abs((touchStartX.current || 0) - (touchEndX.current || 0));
    const diffY = Math.abs((touchStartY.current || 0) - (touchEndY.current || 0));
    
    if (diffX > threshold || diffY > threshold) {
      touchMoved.current = true;
      
      // If configured to prevent default (e.g., to prevent page scrolling during swipe)
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current || 
        !touchStartY.current || !touchEndY.current) {
      return;
    }
    
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    
    // Determine if the gesture was a swipe or a tap
    if (touchMoved.current) {
      // Determine if the gesture was more horizontal or vertical
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > threshold && onSwipeLeft) {
          // Swiped left
          onSwipeLeft();
        } else if (diffX < -threshold && onSwipeRight) {
          // Swiped right
          onSwipeRight();
        }
      } else {
        // Vertical swipe
        if (diffY > threshold && onSwipeUp) {
          // Swiped up
          onSwipeUp();
        } else if (diffY < -threshold && onSwipeDown) {
          // Swiped down
          onSwipeDown();
        }
      }
    } else if (onTap) {
      // It was a tap
      onTap(touchEndX.current, touchEndY.current);
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
    touchMoved.current = false;
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
