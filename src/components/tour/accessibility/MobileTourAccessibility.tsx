
import React, { useEffect } from 'react';
import { useTour } from '@/contexts/tour';

interface MobileTourAccessibilityProps {
  isActive: boolean;
  isPortrait: boolean;
}

/**
 * MobileTourAccessibility Component
 * 
 * Handles accessibility concerns specific to mobile devices during tour.
 * - Prevents background scrolling
 * - Manages touch events
 * - Handles focus for screen readers
 */
export const MobileTourAccessibility: React.FC<MobileTourAccessibilityProps> = ({
  isActive,
  isPortrait
}) => {
  const { currentStepData } = useTour();
  
  // Prevent background scrolling when tour is active in portrait mode
  useEffect(() => {
    if (isActive && isPortrait) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Disable scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isActive, isPortrait]);
  
  // Add ARIA live announcements for mobile tours
  useEffect(() => {
    if (isActive && currentStepData) {
      // For mobile devices, announce the entire tour content
      const mobileAnnouncement = `Tour step ${currentStepData.title}. ${currentStepData.content}`;
      
      // Access live region and announce
      const liveRegion = document.getElementById('tour-announcer');
      if (liveRegion) {
        liveRegion.textContent = mobileAnnouncement;
      }
    }
  }, [isActive, currentStepData]);
  
  // Don't render anything visible
  return null;
};
