
import { useState, useCallback, useEffect } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { useTourState } from './controller/tour-controller/use-tour-state';
import { useTourPathLoading } from './controller/tour-controller/use-tour-path-loading';
import { useTourPersistence } from './controller/tour-controller/use-tour-persistence';
import { useTourAnalyticsIntegration } from './controller/tour-controller/use-tour-analytics-integration';
import { useTourNavigation } from './controller/tour-controller/use-tour-navigation';
import { useTourContent } from './controller/use-tour-content';
import { useTourHandlers } from './controller/use-tour-handlers';
import { useTourKeyboard } from './controller/use-tour-keyboard';
import { getCurrentStepData } from './controller/step-processor';

/**
 * Custom hook for managing tour state and navigation
 * 
 * @param initialPaths Available tour paths
 * @param currentPathname Current application route for context-aware tours
 * @returns Object with tour state and control functions
 */
export function useTourController(
  initialPaths: TourPath[] = [],
  currentPathname: string = '/',
  userId?: string,
  userType?: string
) {
  // Use modular hooks to compose functionality
  const {
    isActive,
    currentPath,
    currentStep,
    tourPaths,
    visibleSteps,
    setIsActive,
    toggleActive,
    setCurrentPath,
    setCurrentStep,
    setTourPaths,
    setVisibleSteps,
    getCurrentPathData
  } = useTourState(initialPaths);

  // Setup tour persistence
  const {
    markCurrentTourCompleted
  } = useTourPersistence(
    isActive,
    currentPath,
    currentStep
  );

  // Setup analytics integration
  const {
    trackEvent
  } = useTourAnalyticsIntegration(userId, userType);

  // Load tour paths based on the current route
  useTourPathLoading(
    currentPathname,
    currentPath,
    setTourPaths,
    setVisibleSteps,
    getCurrentPathData
  );

  // Tour content management
  const {
    setDynamicContent,
    getContentForStep
  } = useTourContent(visibleSteps, setVisibleSteps);

  // Tour navigation handlers
  const {
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep
  } = useTourHandlers(
    isActive,
    currentStep,
    currentPath,
    visibleSteps,
    currentPathname,
    userId,
    userType,
    {
      setCurrentStep,
      toggleActive,
      setCurrentPath,
      markTourCompleted: markCurrentTourCompleted,
      trackEvent
    }
  );

  // Handle keyboard navigation
  const handleNavigationAction = useCallback((
    event: React.KeyboardEvent | KeyboardEvent, 
    action: 'next' | 'previous' | 'first' | 'last' | 'close' | 'jump_forward' | 'jump_backward' | 'show_shortcuts_help'
  ) => {
    event.preventDefault();
    
    switch (action) {
      case 'next':
        nextStep();
        break;
      case 'previous':
        prevStep();
        break;
      case 'first':
        goToStep(0);
        break;
      case 'last':
        goToStep(visibleSteps.length - 1);
        break;
      case 'jump_forward':
        goToStep(Math.min(currentStep + 3, visibleSteps.length - 1));
        break;
      case 'jump_backward':
        goToStep(Math.max(currentStep - 3, 0));
        break;
      case 'close':
        endTour();
        break;
      // 'show_shortcuts_help' is handled by the component using this hook
    }
  }, [nextStep, prevStep, goToStep, endTour, currentStep, visibleSteps.length]);

  const { handleKeyNavigation } = useTourKeyboard(
    isActive,
    handleNavigationAction,
    {
      enableHomeEndKeys: true,
      enablePageKeys: true,
      pageKeyJumpSize: 3,
      enableShortcutsHelp: true
    }
  );

  // Get current step data
  const currentStepData = getCurrentStepData(visibleSteps, currentStep);
  
  // Get dynamic content for current step
  const content = currentStepData ? getContentForStep(currentStepData) : '';

  return {
    isActive,
    currentPath,
    currentStep,
    totalSteps: visibleSteps.length,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    currentStepData,
    availablePaths: tourPaths,
    handleKeyNavigation,
    visibleSteps,
    setDynamicContent,
    content,
  };
}
