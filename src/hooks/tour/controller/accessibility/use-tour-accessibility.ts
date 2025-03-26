
import { useEffect, useRef } from 'react';
import { TourStep } from '@/contexts/tour/types';

/**
 * Hook to enhance tour accessibility features
 * 
 * @param isActive Whether the tour is active
 * @param currentStep Current step index
 * @param totalSteps Total number of steps
 * @param currentStepData Current step data
 * @returns Object with accessibility enhancing functions and data
 */
export function useTourAccessibility(
  isActive: boolean,
  currentStep: number,
  totalSteps: number,
  currentStepData: TourStep | null
) {
  const previousStepRef = useRef<number>(-1);
  const announcementsMadeRef = useRef<Set<string>>(new Set());
  
  // Reset announcements when tour is activated or deactivated
  useEffect(() => {
    if (isActive) {
      announcementsMadeRef.current = new Set();
      
      // Announce tour started
      announceToScreenReader(`Tour started. ${totalSteps} steps in total.`);
    } else if (previousStepRef.current !== -1) {
      // Announce tour ended
      announceToScreenReader('Tour ended.');
      previousStepRef.current = -1;
    }
  }, [isActive, totalSteps]);
  
  // Announce step changes
  useEffect(() => {
    if (isActive && currentStepData) {
      // Only announce if this is a step change (not initial load)
      if (previousStepRef.current !== -1 && previousStepRef.current !== currentStep) {
        const direction = currentStep > previousStepRef.current ? 'next' : 'previous';
        const message = `Step ${currentStep + 1} of ${totalSteps}: ${currentStepData.title}`;
        
        // Create a unique key for this announcement
        const announcementKey = `step-${currentStep}-${direction}`;
        
        // Only announce if we haven't already announced this exact message
        if (!announcementsMadeRef.current.has(announcementKey)) {
          announceToScreenReader(message);
          announcementsMadeRef.current.add(announcementKey);
        }
      }
      
      // Update the previous step reference
      previousStepRef.current = currentStep;
    }
  }, [isActive, currentStep, totalSteps, currentStepData]);
  
  // Helper function to announce messages to screen reader
  const announceToScreenReader = (message: string) => {
    // Find or create the live region
    let liveRegion = document.getElementById('tour-announcer');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'tour-announcer';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    
    // Update the content to trigger the announcement
    liveRegion.textContent = message;
    
    // Clear the live region after a delay to prevent duplicate announcements
    setTimeout(() => {
      if (liveRegion) liveRegion.textContent = '';
    }, 3000);
  };
  
  return {
    announceToScreenReader,
    progressAnnouncement: `Step ${currentStep + 1} of ${totalSteps}`,
    stepAnnouncement: currentStepData 
      ? `Current step: ${currentStepData.title}` 
      : 'Loading tour step...'
  };
}
