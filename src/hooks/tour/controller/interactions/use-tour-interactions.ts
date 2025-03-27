
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { useTourAnalytics } from '../../useTourAnalytics';
import { trackStepInteraction } from '../analytics/tour-analytics-utils';

interface TourNavigationHandlers {
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

/**
 * Hook to manage tour interactions (user actions with the tour UI)
 */
export function useTourInteractions(
  currentStepData: TourStep | null,
  currentPath: string | null,
  tourPaths: TourPath[],
  currentStep: number,
  userId?: string,
  userType?: string,
  handlers?: TourNavigationHandlers
) {
  const analytics = useTourAnalytics();
  
  // Handle various navigation actions
  const handleNavigationAction = useCallback((action: string) => {
    if (!currentStepData || !currentPath || !handlers) return;
    
    const pathData = tourPaths.find(p => p.id === currentPath);
    if (!pathData) return;
    
    // Use the imported utility function since it may not exist in the analytics object
    trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      action,
      userId,
      userType
    );
    
    // Perform the action based on the action type
    switch (action) {
      case 'next':
        handlers.nextStep();
        break;
      case 'prev':
        handlers.prevStep();
        break;
      case 'skip':
      case 'close':
        handlers.endTour();
        break;
    }
  }, [currentStepData, currentPath, tourPaths, currentStep, handlers, userId, userType]);
  
  // Handle step completion
  const handleStepComplete = useCallback(() => {
    if (!currentStepData || !currentPath) return;
    
    const pathData = tourPaths.find(p => p.id === currentPath);
    if (!pathData) return;
    
    // Use the utility function
    trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      'complete',
      userId,
      userType
    );
    
    // Move to next step
    if (handlers) {
      handlers.nextStep();
    }
  }, [currentStepData, currentPath, tourPaths, currentStep, handlers, userId, userType]);
  
  // Handle step skipping
  const handleStepSkip = useCallback(() => {
    if (!currentStepData || !currentPath) return;
    
    const pathData = tourPaths.find(p => p.id === currentPath);
    if (!pathData) return;
    
    // Use the utility function
    trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      'skip',
      userId,
      userType
    );
    
    // End the tour
    if (handlers) {
      handlers.endTour();
    }
  }, [currentStepData, currentPath, tourPaths, currentStep, handlers, userId, userType]);
  
  // Handle direct element interaction
  const handleElementInteraction = useCallback((actionType: string) => {
    if (!currentStepData || !currentPath) return;
    
    const pathData = tourPaths.find(p => p.id === currentPath);
    if (!pathData) return;
    
    // Use the utility function
    trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      `element_${actionType}`,
      userId,
      userType
    );
  }, [currentStepData, currentPath, tourPaths, currentStep, userId, userType]);
  
  return {
    handleNavigationAction,
    handleStepComplete,
    handleStepSkip,
    handleElementInteraction
  };
}
