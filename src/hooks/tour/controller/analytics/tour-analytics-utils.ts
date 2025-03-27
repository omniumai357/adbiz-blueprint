
import { TourStep, TourPath } from '@/contexts/tour/types';
import { TourStepData } from './types';

// Add a trackStepInteraction function that can be used by other components
export const trackStepInteraction = (
  pathData: TourPath,
  currentStepData: TourStep,
  currentStep: number,
  interactionType: string,
  userId?: string,
  userType?: string
): boolean => {
  // Create step data for tracking
  const stepData: TourStepData = {
    pathId: pathData.id,
    tourId: pathData.id,
    tourName: pathData.name,
    stepId: currentStepData.id,
    stepIndex: currentStep,
    totalSteps: pathData.steps.length,
    userId: userId || 'anonymous',
    userType: userType || 'guest'
  };

  // Log the interaction
  console.log(`Tour interaction: ${interactionType}`, stepData);
  
  // Emit a custom event
  const event = new CustomEvent('tour:interaction', { 
    detail: { type: interactionType, ...stepData }
  });
  document.dispatchEvent(event);
  
  return true;
};
