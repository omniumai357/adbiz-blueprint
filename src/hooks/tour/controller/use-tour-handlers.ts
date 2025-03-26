
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';

/**
 * Hook for handling tour actions and navigation
 */
export function useTourHandlers(
  isActive: boolean,
  currentStep: number,
  currentPath: string | null,
  visibleSteps: TourStep[],
  currentPathname: string,
  userId?: string,
  userType?: string,
  actions?: {
    setCurrentStep: (step: number) => void;
    toggleActive: (state?: boolean) => void;
    setCurrentPath: (path: string) => void;
    markTourCompleted?: (pathId: string) => void;
    trackEvent?: (eventName: string, data?: any) => void;
  }
) {
  // End tour and clean up
  const endAndCleanupTour = useCallback(() => {
    if (!actions) return;
    
    actions.toggleActive(false);
    
    // If there's a current path, mark it as completed
    if (currentPath && actions.markTourCompleted) {
      actions.trackEvent?.('tour_completed', { 
        path: currentPath, 
        step: currentStep,
        userId,
        userType
      });
      actions.markTourCompleted(currentPath);
    }
  }, [currentPath, currentStep, actions, userId, userType]);

  // Start a tour
  const startTour = useCallback((pathId: string) => {
    if (!actions) return;
    
    actions.setCurrentPath(pathId);
    actions.setCurrentStep(0);
    actions.toggleActive(true);
    
    actions.trackEvent?.('tour_started', { 
      path: pathId, 
      url: currentPathname,
      userId,
      userType
    });
  }, [actions, currentPathname, userId, userType]);

  // Handle next step
  const nextStep = useCallback(() => {
    if (!actions || !isActive || visibleSteps.length === 0) return;
    
    if (currentStep < visibleSteps.length - 1) {
      actions.trackEvent?.('step_completed', {
        path: currentPath,
        step: currentStep,
        stepId: visibleSteps[currentStep]?.id,
        userId,
        userType
      });
      
      actions.setCurrentStep(currentStep + 1);
    } else {
      // End tour if we're on the last step
      endAndCleanupTour();
    }
  }, [isActive, currentStep, visibleSteps, actions, currentPath, endAndCleanupTour, userId, userType]);

  // Handle previous step
  const prevStep = useCallback(() => {
    if (!actions || !isActive || currentStep <= 0) return;
    
    actions.trackEvent?.('step_back', {
      path: currentPath,
      step: currentStep,
      stepId: visibleSteps[currentStep]?.id,
      userId,
      userType
    });
    
    actions.setCurrentStep(currentStep - 1);
  }, [isActive, currentStep, actions, currentPath, visibleSteps, userId, userType]);

  // Go to specific step
  const goToStep = useCallback((stepIndex: number) => {
    if (!actions || !isActive || stepIndex < 0 || stepIndex >= visibleSteps.length) return;
    
    actions.trackEvent?.('jump_to_step', {
      path: currentPath,
      fromStep: currentStep,
      toStep: stepIndex,
      userId,
      userType
    });
    
    actions.setCurrentStep(stepIndex);
  }, [isActive, currentStep, visibleSteps, actions, currentPath, userId, userType]);

  return {
    startTour,
    endTour: endAndCleanupTour,
    nextStep,
    prevStep,
    goToStep
  };
}
