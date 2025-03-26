
import { useCallback, useEffect } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useTourAnalytics } from '../../useTourAnalytics';
import { handleKeyNavigation, NavigationHandler } from '../key-navigation';

/**
 * Hook to integrate analytics into tour
 */
export function useTourAnalyticsIntegration(
  isActive: boolean,
  currentPath: string | null,
  tourPaths: TourPath[],
  currentStep: number,
  visibleSteps: TourStep[],
  getCurrentPathData: () => TourPath | undefined,
  nextStep: () => void,
  prevStep: () => void,
  endAndCleanupTour: () => void,
  markCurrentTourCompleted: () => void,
  userId?: string,
  userType?: string
) {
  const analytics = useTourAnalytics();
  
  // Track when steps are viewed
  useEffect(() => {
    if (isActive && currentPath) {
      const pathData = getCurrentPathData();
      const currentStepData = visibleSteps[currentStep];
      
      if (pathData && currentStepData) {
        analytics.trackStepViewed(pathData, currentStepData, currentStep, userId, userType);
      }
    }
  }, [isActive, currentPath, currentStep, visibleSteps, getCurrentPathData, analytics, userId, userType]);

  // Handle tour completion and analytics
  const endTour = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData) {
      // Determine if tour was completed or abandoned
      const wasCompleted = currentStep === visibleSteps.length - 1;
      
      if (wasCompleted) {
        analytics.trackTourCompleted(pathData, userId, userType);
        markCurrentTourCompleted();
      } else {
        analytics.trackTourAbandoned(pathData, currentStep, userId, userType);
      }
    }
    
    endAndCleanupTour();
  }, [getCurrentPathData, currentStep, visibleSteps.length, analytics, userId, userType, endAndCleanupTour, markCurrentTourCompleted]);

  // Start tour with analytics
  const startTour = useCallback((pathId: string) => {
    const pathData = tourPaths.find((path) => path.id === pathId);
    const pathExists = !!pathData;
    
    if (pathExists && pathData) {
      // Track tour start
      analytics.trackTourStarted(pathData, userId, userType);
    }
  }, [tourPaths, analytics, userId, userType]);

  // Add a dummy goToStep function to fix the NavigationHandler compatibility
  const goToStepDummy = useCallback((stepIndex: number) => {
    console.warn('goToStep called from analytics integration, but not implemented');
  }, []);

  // Add showKeyboardShortcutsHelp function
  const showKeyboardShortcutsHelp = useCallback(() => {
    console.warn('showKeyboardShortcutsHelp called from analytics integration, but not implemented');
  }, []);

  // Handle keyboard navigation
  const keyboardNavigationHandler = useCallback((event: React.KeyboardEvent) => {
    const handlers: NavigationHandler = {
      nextStep,
      prevStep,
      endTour,
      goToStep: goToStepDummy,
      trackInteraction: analytics.trackStepInteraction,
      showKeyboardShortcutsHelp
    };

    // Pass the correct number of arguments
    handleKeyNavigation(event, undefined, {
      isActive,
      currentPath,
      tourPaths,
      currentStep,
      totalSteps: visibleSteps.length,
      visibleSteps,
      userId,
      userType,
      handlers
    });
  }, [isActive, currentPath, tourPaths, currentStep, visibleSteps, userId, userType, nextStep, prevStep, endTour, analytics.trackStepInteraction, goToStepDummy, showKeyboardShortcutsHelp]);

  return {
    startTour,
    endTour,
    keyboardNavigationHandler,
    trackStepSkipped: analytics.trackStepSkipped,
    trackStepInteraction: analytics.trackStepInteraction
  };
}
