
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface TourSkipNavigationProps {
  isActive: boolean;
  onSkipToMain: () => void;
  isTouchDevice?: boolean;
  deviceType?: "mobile" | "tablet" | "desktop";
}

/**
 * Component that provides skip navigation links for keyboard users
 * and alternative skip methods for touch device users
 * 
 * This component renders visually hidden links that become visible on focus,
 * allowing keyboard users to bypass the tour and go directly to main content.
 */
export const TourSkipNavigation: React.FC<TourSkipNavigationProps> = ({
  isActive,
  onSkipToMain,
  isTouchDevice = false,
  deviceType = "desktop"
}) => {
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle keyboard shortcut for skip navigation (Tab+S)
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Tab+S combination
      if (event.key === 's' || event.key === 'S') {
        const activeElement = document.activeElement;
        
        // Check if focus is on a tabbable element
        if (
          activeElement && 
          (activeElement.tagName === 'BUTTON' || 
           activeElement.tagName === 'A' || 
           activeElement.tagName === 'INPUT' ||
           activeElement.hasAttribute('tabindex'))
        ) {
          onSkipToMain();
          event.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onSkipToMain]);
  
  // Add touch-specific skip gesture detection
  useEffect(() => {
    if (!isActive || !isTouchDevice) return;
    
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 3) { // Three finger touch
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
        touchStartTime = Date.now();
      }
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      // For three-finger swipe down
      if (touchStartY && touchStartTime && Date.now() - touchStartTime < 500) {
        const touchEndY = event.changedTouches[0].clientY;
        const touchEndX = event.changedTouches[0].clientX;
        
        const yDiff = touchEndY - touchStartY;
        const xDiff = Math.abs(touchEndX - touchStartX);
        
        // Detect a deliberate downward swipe with 3 fingers
        if (yDiff > 100 && xDiff < 50) {
          onSkipToMain();
          event.preventDefault();
        }
      }
      
      touchStartY = 0;
      touchStartX = 0;
      touchStartTime = 0;
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, isTouchDevice, onSkipToMain]);
  
  if (!isActive) return null;
  
  return (
    <div className="tour-skip-navigation">
      {/* Skip link that's visually hidden but becomes visible on focus */}
      <Button
        ref={skipButtonRef}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:shadow-lg"
        onClick={onSkipToMain}
        aria-label="Skip tour and go to main content"
      >
        Skip tour to main content
      </Button>
      
      {/* Create visually hidden hints for screen readers */}
      <span className="sr-only" aria-live="polite">
        {isTouchDevice ? 
          "Use a three-finger swipe down to skip the tour, or press Tab+S at any time" :
          "Press Tab+S at any time to skip the tour and go to main content"
        }
      </span>
      
      {/* Touch-specific hint for mobile/tablet users */}
      {isTouchDevice && (deviceType === "mobile" || deviceType === "tablet") && (
        <div className="fixed bottom-4 left-0 right-0 text-center z-[70] pointer-events-none">
          <div 
            className="inline-block bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-auto animate-fade-in"
            role="status"
            aria-live="polite"
          >
            Three-finger swipe down to skip tour
          </div>
        </div>
      )}
    </div>
  );
};
