
import { useCallback, useMemo } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { NavigationAction } from './types';
import { handleNavigationAction, parseNavigationAction } from './navigation-actions';
import { useTourAnalyticsTracking } from './use-tour-analytics-tracking';

/**
 * Enhanced tour navigation hook that combines keyboard, gesture, and button navigation
 * with analytics tracking
 */
export const useEnhancedTourNavigation = (
  isActive: boolean,
  currentPath: string | null,
  currentStep: number,
  availablePaths: TourPath[],
  totalSteps: number,
  handlers: {
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    endTour: () => void;
  },
  userContext?: {
    userId?: string;
    userType?: string;
  }
) => {
  const { nextStep, prevStep, goToStep, endTour } = handlers;
  
  // Get the current path data and step data
  const currentPathData = useMemo(() => 
    availablePaths.find(path => path.id === currentPath),
    [availablePaths, currentPath]
  );
  
  const currentStepData = useMemo(() => 
    currentPathData?.steps[currentStep] || null,
    [currentPathData, currentStep]
  );
  
  // Set up analytics tracking
  const trackNavigation = useTourAnalyticsTracking(
    currentPathData, 
    currentStepData,
    currentStep,
    userContext?.userId,
    userContext?.userType
  );
  
  // Handle keyboard navigation
  const handleKeyNavigation = useCallback((
    event: React.KeyboardEvent | KeyboardEvent,
    action: NavigationAction | null
  ) => {
    if (!isActive || !action) return;
    
    event.preventDefault();
    
    // Handle navigation based on the action
    handleNavigationAction(action, {
      goToNext: () => {
        trackNavigation('keyboard_next');
        nextStep();
      },
      goToPrevious: () => {
        trackNavigation('keyboard_previous');
        prevStep();
      },
      close: () => {
        trackNavigation('keyboard_close');
        endTour();
      },
      goToFirst: () => {
        trackNavigation('keyboard_first');
        goToStep(0);
      },
      goToLast: () => {
        trackNavigation('keyboard_last');
        goToStep(totalSteps - 1);
      },
      jumpForward: (steps: number) => {
        trackNavigation('keyboard_jump_forward');
        goToStep(Math.min(currentStep + steps, totalSteps - 1));
      },
      jumpBackward: (steps: number) => {
        trackNavigation('keyboard_jump_backward');
        goToStep(Math.max(currentStep - steps, 0));
      },
      showShortcuts: () => {
        trackNavigation('show_shortcuts');
        // This would be handled by the component using this hook
      }
    });
  }, [isActive, nextStep, prevStep, endTour, goToStep, currentStep, totalSteps, trackNavigation]);
  
  // Navigation handlers with tracking
  const navigationHandlers = useMemo(() => ({
    handleNext: () => {
      trackNavigation('button_next');
      nextStep();
    },
    handlePrevious: () => {
      trackNavigation('button_previous');
      prevStep();
    },
    handleClose: () => {
      trackNavigation('button_close');
      endTour();
    },
    handleGoTo: (step: number) => {
      trackNavigation('button_goto');
      goToStep(step);
    },
    handleKeyNavigation
  }), [nextStep, prevStep, endTour, goToStep, trackNavigation, handleKeyNavigation]);
  
  return navigationHandlers;
};
