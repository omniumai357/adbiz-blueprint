
import { useState, useCallback, useEffect, KeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { 
  useTourState,
  useTourNavigation,
  useTourPersistence,
  useTourAnalyticsIntegration,
  useTourPathLoading,
  useDynamicContent
} from './controller/tour-controller';

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
  // Use the modular hooks to compose functionality
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

  // Load tour paths based on the current route
  useTourPathLoading(
    currentPathname,
    currentPath,
    setTourPaths,
    setVisibleSteps,
    getCurrentPathData
  );

  // We need to get analytics before navigation since navigation depends on analytics
  const {
    startTour: analyticsStartTour,
    endTour,
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
    () => {}, // Will be replaced with actual nextStep
    () => {}, // Will be replaced with actual prevStep
    endAndCleanupTour,
    markCurrentTourCompleted,
    userId,
    userType
  );

  const {
    nextStep,
    prevStep,
    goToStep,
    getStepData,
    getTotalSteps
  } = useTourNavigation(
    currentStep,
    visibleSteps,
    setCurrentStep,
    getCurrentPathData,
    trackStepSkipped,
    trackStepInteraction,
    endTour,
    userId,
    userType
  );

  const {
    setDynamicContent
  } = useDynamicContent(
    visibleSteps,
    setVisibleSteps,
    setTourPaths
  );

  // Start a tour with proper state initialization
  const startTour = useCallback((pathId: string) => {
    const pathData = tourPaths.find((path) => path.id === pathId);
    const pathExists = !!pathData;
    
    if (pathExists && pathData) {
      setCurrentPath(pathId);
      setCurrentStep(0);
      toggleActive(true);
      
      // Track tour start via analytics
      analyticsStartTour(pathId);
    }
  }, [tourPaths, toggleActive, setCurrentPath, setCurrentStep, analyticsStartTour]);

  return {
    isActive,
    currentPath,
    currentStep,
    totalSteps: getTotalSteps(),
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    currentStepData: getStepData(),
    availablePaths: tourPaths,
    handleKeyNavigation: keyboardNavigationHandler,
    visibleSteps,
    setDynamicContent,
  };
}
