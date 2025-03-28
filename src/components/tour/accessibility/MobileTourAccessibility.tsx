
import React, { useEffect } from 'react';

interface MobileTourAccessibilityProps {
  isActive: boolean;
  isPortrait: boolean;
}

/**
 * Component that handles accessibility concerns specific to mobile tour views
 */
export const MobileTourAccessibility: React.FC<MobileTourAccessibilityProps> = ({
  isActive,
  isPortrait
}) => {
  // Prevent body scrolling when tour is active on mobile portrait mode
  useEffect(() => {
    if (isActive && isPortrait) {
      // Store original body styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;
      
      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Lock body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Add aria attributes to main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
      
      return () => {
        // Restore body styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
        
        // Remove aria attributes
        if (mainContent) {
          mainContent.removeAttribute('aria-hidden');
        }
      };
    }
  }, [isActive, isPortrait]);
  
  // This component doesn't render anything visible, it just handles side effects
  return null;
};
