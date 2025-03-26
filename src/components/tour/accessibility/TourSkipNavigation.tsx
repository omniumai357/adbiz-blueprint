
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface TourSkipNavigationProps {
  isActive: boolean;
  onSkipToMain: () => void;
}

/**
 * Component that provides skip navigation links for keyboard users
 * 
 * This component renders visually hidden links that become visible on focus,
 * allowing keyboard users to bypass the tour and go directly to main content.
 */
export const TourSkipNavigation: React.FC<TourSkipNavigationProps> = ({
  isActive,
  onSkipToMain
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
        Press Tab+S at any time to skip the tour and go to main content
      </span>
    </div>
  );
};
