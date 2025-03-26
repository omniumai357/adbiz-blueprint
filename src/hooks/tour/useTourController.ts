
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
    visibleSteps,
    getCurrentPathData,
    () => {}, // placeholder for nextStep
    () => {}, // placeholder for prevStep
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
    visibleSteps,
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
    getCurrentStepData(visibleSteps, currentStep),
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
    getCurrentStepData(visibleSteps, currentStep)
  );

  // Handle keyboard navigation
  const { handleKeyNavigation } = useTourKeyboard(
    isActive,
    interactions.handleNavigationAction,
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
  
  // Calculate total steps
  const totalSteps = visibleSteps?.length || 0;

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
