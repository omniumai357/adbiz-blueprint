
import { useRef, TouchEvent } from 'react';

interface TourGestureOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
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
  onSwipeDown
}: TourGestureOptions = {}) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || 
        !touchStartY.current || !touchEndY.current) {
      return;
    }
    
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    
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
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
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
