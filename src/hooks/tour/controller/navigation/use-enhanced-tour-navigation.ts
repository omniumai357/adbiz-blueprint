
import { useCallback } from 'react';
import { useTour } from '@/contexts/tour';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { useTourAnalytics } from '@/hooks/tour/useTourAnalytics';
import { useAuth } from '@/features/auth';
import { NavigationAction } from './types';

/**
 * Enhanced tour navigation hook with analytics integration
 */
export function useEnhancedTourNavigation() {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    currentPath,
    currentPathData,
    nextStep,
    prevStep,
    goToStep,
    endTour
  } = useTour();
  
  const { user } = useAuth();
  const analytics = useTourAnalytics();

  const handleNavigationAction = useCallback((
    event: React.KeyboardEvent | KeyboardEvent,
    action: NavigationAction
  ) => {
    if (!isActive || !currentPathData || !currentStepData) return;
    
    switch (action) {
      case 'next_keyboard_shortcut':
      case 'next_from_element':
        // Track analytics before moving to next step
        analytics.trackStepInteraction(
          currentPathData,
          currentStepData,
          currentStep,
          'next_keyboard',
          user?.id,
          user?.type
        );
        nextStep();
        break;
        
      case 'previous_keyboard_shortcut':
        // Track analytics before moving to previous step
        analytics.trackStepInteraction(
          currentPathData,
          currentStepData,
          currentStep,
          'previous_keyboard',
          user?.id,
          user?.type
        );
        prevStep();
        break;
        
      case 'first_step':
        // Track jump to first step
        analytics.trackStepInteraction(
          currentPathData,
          currentStepData,
          currentStep,
          'jump_to_first',
          user?.id,
          user?.type
        );
        goToStep(0);
        break;
        
      case 'last_step':
        // Track jump to last step
        analytics.trackStepInteraction(
          currentPathData,
          currentStepData,
          currentStep,
          'jump_to_last',
          user?.id,
          user?.type
        );
        goToStep(totalSteps - 1);
        break;
        
      case 'escape':
        // Track tour exit via escape key
        analytics.trackTourExit(
          currentPathData,
          currentStepData,
          currentStep,
          'escape_key',
          user?.id,
          user?.type
        );
        endTour();
        break;
        
      default:
        // Handle jump navigation
        if (action.startsWith('jump_forward_')) {
          const jumpSize = parseInt(action.replace('jump_forward_', ''), 10);
          
          if (!isNaN(jumpSize)) {
            const targetStep = Math.min(currentStep + jumpSize, totalSteps - 1);
            
            analytics.trackStepInteraction(
              currentPathData,
              currentStepData,
              currentStep,
              `jump_forward_${jumpSize}`,
              user?.id,
              user?.type
            );
            
            goToStep(targetStep);
          }
        } else if (action.startsWith('jump_back_')) {
          const jumpSize = parseInt(action.replace('jump_back_', ''), 10);
          
          if (!isNaN(jumpSize)) {
            const targetStep = Math.max(currentStep - jumpSize, 0);
            
            analytics.trackStepInteraction(
              currentPathData,
              currentStepData,
              currentStep,
              `jump_back_${jumpSize}`,
              user?.id,
              user?.type
            );
            
            goToStep(targetStep);
          }
        }
    }
  }, [
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    currentPath,
    currentPathData,
    nextStep,
    prevStep,
    goToStep,
    endTour,
    analytics,
    user
  ]);

  return {
    handleNavigationAction
  };
}
