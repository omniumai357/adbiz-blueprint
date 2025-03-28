
import { useState, useCallback } from 'react';

interface GestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  preventScrollOnSwipe?: boolean;
  vibrate?: boolean;
  longPressDelay?: number;
}

export function useTourGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  threshold = 50,
  preventScrollOnSwipe = false,
  vibrate = false,
  longPressDelay = 500
}: GestureOptions) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setTouchStart(startData);
    
    // Set up long press timer
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress();
        // Optional vibration feedback
        if (vibrate && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, longPressDelay);
      
      setLongPressTimer(timer);
    }
  }, [onLongPress, longPressDelay, vibrate]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;
    
    // Clear long press timer on movement
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    const touch = e.touches[0];
    const diffX = touchStart.x - touch.clientX;
    const diffY = touchStart.y - touch.clientY;
    
    // Prevent default if we need to stop scrolling
    if (preventScrollOnSwipe && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      e.preventDefault();
    }
  }, [touchStart, longPressTimer, preventScrollOnSwipe]);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Process gesture
    if (touchStart) {
      const touch = e.changedTouches[0];
      const diffX = touchStart.x - touch.clientX;
      const diffY = touchStart.y - touch.clientY;
      const duration = Date.now() - touchStart.time;
      
      // Determine if it was a tap
      const isTap = Math.abs(diffX) < 10 && Math.abs(diffY) < 10 && duration < 300;
      
      if (isTap && onTap) {
        onTap();
      } else {
        // Horizontal swipe takes precedence over vertical if both thresholds are exceeded
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
          // Horizontal swipe
          if (diffX > 0 && onSwipeLeft) {
            onSwipeLeft();
            if (vibrate && navigator.vibrate) navigator.vibrate(20);
          } else if (diffX < 0 && onSwipeRight) {
            onSwipeRight();
            if (vibrate && navigator.vibrate) navigator.vibrate(20);
          }
        } else if (Math.abs(diffY) > threshold) {
          // Vertical swipe
          if (diffY > 0 && onSwipeUp) {
            onSwipeUp();
            if (vibrate && navigator.vibrate) navigator.vibrate(20);
          } else if (diffY < 0 && onSwipeDown) {
            onSwipeDown();
            if (vibrate && navigator.vibrate) navigator.vibrate(20);
          }
        }
      }
    }
    
    // Reset touch start
    setTouchStart(null);
  }, [touchStart, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, longPressTimer, vibrate]);
  
  const handleTouchCancel = useCallback(() => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Reset touch start
    setTouchStart(null);
  }, [longPressTimer]);
  
  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  };
}
