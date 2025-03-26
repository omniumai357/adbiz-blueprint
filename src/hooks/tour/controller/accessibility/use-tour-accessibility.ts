
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
      
      // Announce tour started with detailed instructions
      announceToScreenReader(
        `Tour started. ${totalSteps} steps in total. Use arrow keys to navigate, Space to select, and Escape to exit the tour.`,
        'assertive'
      );
    } else if (previousStepRef.current !== -1) {
      // Announce tour ended with more context
      announceToScreenReader('Tour ended. Focus is now returned to the page.', 'assertive');
      previousStepRef.current = -1;
    }
  }, [isActive, totalSteps]);
  
  // Announce step changes
  useEffect(() => {
    if (isActive && currentStepData) {
      // Only announce if this is a step change (not initial load)
      if (previousStepRef.current !== -1 && previousStepRef.current !== currentStep) {
        const direction = currentStep > previousStepRef.current ? 'next' : 'previous';
        
        // Create a more descriptive and helpful announcement
        let message = `Step ${currentStep + 1} of ${totalSteps}: ${currentStepData.title}. ${currentStepData.content || ''}`;
        
        // Add navigation hints based on current position
        if (currentStep > 0 && currentStep < totalSteps - 1) {
          message += " You can go to the previous step or continue to the next step.";
        } else if (currentStep === 0) {
          message += " You are at the first step. You can continue to the next step.";
        } else if (currentStep === totalSteps - 1) {
          message += " You are at the last step. You can complete the tour or go back to the previous step.";
        }
        
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
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Find or create the appropriate live region based on priority
    const regionId = priority === 'assertive' ? 'tour-assertive-announcer' : 'tour-polite-announcer';
    let liveRegion = document.getElementById(regionId);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = regionId;
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
      document.body.appendChild(liveRegion);
    }
    
    // Clear the content first to ensure it will be announced even if the text hasn't changed
    liveRegion.textContent = '';
    
    // Small delay to ensure screen readers recognize the change
    setTimeout(() => {
      if (liveRegion) liveRegion.textContent = message;
      
      // Clear the live region after a delay to prevent duplicate announcements
      setTimeout(() => {
        if (liveRegion) liveRegion.textContent = '';
      }, priority === 'assertive' ? 3000 : 5000);
    }, 50);
  };
  
  return {
    announceToScreenReader,
    progressAnnouncement: `Step ${currentStep + 1} of ${totalSteps}`,
    stepAnnouncement: currentStepData 
      ? `Current step: ${currentStepData.title}` 
      : 'Loading tour step...'
  };
}
