
import { useEffect } from "react";

/**
 * Hook to track and record tour completion
 * 
 * @param isActive Whether the tour is active
 * @param currentStep Current step index
 * @param totalSteps Total number of steps in the tour
 * @param currentPath Current tour path ID
 */
export function useTourCompletionTracker(
  isActive: boolean,
  currentStep: number,
  totalSteps: number,
  currentPath: string | null
) {
  // Track when a tour is completed
  useEffect(() => {
    if (isActive && currentStep === totalSteps - 1 && currentPath) {
      // Store the completed tour in localStorage
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      if (!completedTours.includes(currentPath)) {
        completedTours.push(currentPath);
        localStorage.setItem('completedTours', JSON.stringify(completedTours));
      }
    }
  }, [isActive, currentStep, totalSteps, currentPath]);
}
