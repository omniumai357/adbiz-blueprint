
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
import { useTourInteractions } from './controller/interactions/use-tour-interactions';
import { useTourAccessibility } from './controller/accessibility/use-tour-accessibility';
import { NavigationAction } from './controller/navigation/types';

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

  // First, define totalSteps before using it
  const totalSteps = visibleSteps?.length || 0;
  // Get current step data
  const currentStepData = getCurrentStepData(visibleSteps, currentStep);

  // Setup tour persistence
  const {
    endAndCleanupTour,
    markCurrentTourCompleted
  } = useTourPersistence(
    isActive,
    currentPath,
    currentStep,
    tourPaths,
    setCurrentPath,
    setCurrentStep,
    toggleActive
  );

  // Tour content management
  const {
    setDynamicContent,
    getContentForStep
  } = useTourContent(visibleSteps, setVisibleSteps);

  // Define handler stub functions to avoid circular dependencies
  const nextStepStub = useCallback(() => {}, []);
  const prevStepStub = useCallback(() => {}, []);

  // Setup analytics integration
  const {
    startTour: analyticsStartTour,
    endTour: analyticsEndTour,
    keyboardNavigationHandler,
    trackStepSkipped,
    trackStepInteraction
  } = useTourAnalyticsIntegration(
    isActive,
    currentPath,
    tourPaths,
    currentStep,
    visibleSteps || [],
    getCurrentPathData,
    nextStepStub,
    prevStepStub,
    endAndCleanupTour,
    markCurrentTourCompleted,
    userId,
    userType
  );

  // Load tour paths based on the current route
  useTourPathLoading(
    currentPathname,
    currentPath,
    setTourPaths,
    setVisibleSteps,
    getCurrentPathData
  );

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
    visibleSteps || [],
    currentPathname,
    userId,
    userType,
    {
      setCurrentStep,
      toggleActive,
      setCurrentPath,
      markTourCompleted: markCurrentTourCompleted,
      trackEvent: (eventName: string, data?: any) => {
        console.log('Tour event:', eventName, data);
        // This is a placeholder for actual event tracking
        // In a real implementation, you would call the appropriate analytics method
      }
    }
  );
  
  // Tour interactions for handling user actions
  const interactions = useTourInteractions(
    currentStepData,
    currentPath,
    tourPaths,
    currentStep,
    userId,
    userType,
    { nextStep, prevStep, endTour }
  );

  // Accessibility enhancements
  const accessibility = useTourAccessibility(
    isActive,
    currentStep,
    totalSteps,
    currentStepData
  );

  // Handle keyboard navigation with correctly typed parameter function
  const { handleKeyNavigation } = useTourKeyboard(
    isActive,
    // Fix the function signature to match expected parameters
    (event: React.KeyboardEvent<Element> | KeyboardEvent, action: NavigationAction) => {
      if (!action) return;
      interactions.handleNavigationAction(action);
    },
    {
      enableHomeEndKeys: true,
      enablePageKeys: true,
      pageKeyJumpSize: 3,
      enableShortcutsHelp: true
    }
  );
  
  // Get dynamic content for current step
  const content = currentStepData ? getContentForStep(currentStepData) : '';

  return {
    isActive,
    currentPath,
    currentStep,
    totalSteps,
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
    ...interactions,
    ...accessibility
  };
}
