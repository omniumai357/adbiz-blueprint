
import { useCallback, useEffect } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useTourAnalytics } from '../../useTourAnalytics';
import { handleKeyNavigation } from '../navigation/keyboard-handler';
import { NavigationHandler } from '../navigation/types';

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
        // Adapt to new API signature by building required data object
        analytics.trackStepViewed({
          pathId: pathData.id,
          tourId: pathData.id,
          tourName: pathData.name || '',
          stepId: currentStepData.id,
          stepIndex: currentStep,
          totalSteps: visibleSteps.length,
          userId: userId || '',
          userType: userType || ''
        });
      }
    }
  }, [isActive, currentPath, currentStep, visibleSteps, getCurrentPathData, analytics, userId, userType]);

  // Handle tour completion and analytics
  const endTour = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData) {
      // Determine if tour was completed or abandoned
      const totalSteps = visibleSteps?.length || 0;
      const wasCompleted = currentStep === totalSteps - 1;
      
      if (wasCompleted) {
        // Adapt to new API signature
        analytics.trackTourCompleted({
          pathId: pathData.id,
          tourId: pathData.id,
          tourName: pathData.name || '',
          totalSteps,
          userId: userId || '',
          userType: userType || '',
          metadata: {}
        });
        markCurrentTourCompleted();
      } else {
        // Adapt to new API signature
        analytics.trackTourExited({
          pathId: pathData.id,
          tourId: pathData.id,
          tourName: pathData.name || '',
          stepIndex: currentStep,
          totalSteps,
          userId: userId || '',
          userType: userType || ''
        });
      }
    }
    
    endAndCleanupTour();
  }, [getCurrentPathData, currentStep, visibleSteps, analytics, userId, userType, endAndCleanupTour, markCurrentTourCompleted]);

  // Start tour with analytics
  const startTour = useCallback((pathId: string) => {
    const pathData = tourPaths.find((path) => path.id === pathId);
    const pathExists = !!pathData;
    
    if (pathExists && pathData) {
      // Track tour start with new API signature
      analytics.trackTourStarted({
        pathId: pathData.id,
        tourId: pathData.id,
        tourName: pathData.name || ''
      });
    }
  }, [tourPaths, analytics]);

  // Add a goToStep function to fix the NavigationHandler compatibility
  const goToStep = useCallback((stepIndex: number) => {
    console.warn('goToStep called from analytics integration, not fully implemented');
    // In a real implementation, this would navigate to the specific step
  }, []);

  // Add showKeyboardShortcutsHelp function
  const showKeyboardShortcutsHelp = useCallback(() => {
    console.warn('showKeyboardShortcutsHelp called from analytics integration, but not implemented');
  }, []);

  // Handle keyboard navigation
  const keyboardNavigationHandler = useCallback((event: React.KeyboardEvent | KeyboardEvent) => {
    const handlers: NavigationHandler = {
      nextStep,
      prevStep,
      endTour,
      goToStep,
      trackInteraction: (pathData, currentStepData, stepIndex, interactionType, userId, userType) => {
        // Adapt to new API signature
        if (!pathData || !currentStepData) return;
        
        const pathObj = typeof pathData === 'string' ? 
          tourPaths.find(p => p.id === pathData) : pathData;
        
        if (!pathObj) return;
        
        analytics.trackInteraction(interactionType, {
          pathId: pathObj.id,
          tourId: pathObj.id,
          tourName: pathObj.name || '',
          stepId: typeof currentStepData === 'string' ? currentStepData : currentStepData.id,
          stepIndex,
          totalSteps: visibleSteps.length,
          userId: userId || '',
          userType: userType || ''
        });
      },
      showKeyboardShortcutsHelp
    };

    // Fixed: Removed the third argument which was causing the error
    handleKeyNavigation(event, {
      isActive,
      currentPath,
      tourPaths,
      currentStep,
      totalSteps: visibleSteps?.length || 0,
      visibleSteps: visibleSteps || [],
      userId,
      userType,
      handlers
    });
  }, [isActive, currentPath, tourPaths, currentStep, visibleSteps, userId, userType, nextStep, prevStep, endTour, analytics, goToStep, showKeyboardShortcutsHelp]);

  // Simplified trackStepSkipped function that adapts to new API
  const adaptedTrackStepSkipped = useCallback((stepId: string, stepIndex: number) => {
    const pathData = getCurrentPathData();
    
    if (pathData) {
      analytics.trackStepSkipped({
        pathId: pathData.id,
        tourId: pathData.id,
        tourName: pathData.name || '',
        stepId,
        stepIndex,
        totalSteps: visibleSteps.length,
        userId: userId || '',
        userType: userType || ''
      });
    }
  }, [getCurrentPathData, analytics, visibleSteps, userId, userType]);

  return {
    startTour,
    endTour,
    keyboardNavigationHandler,
    trackStepSkipped: adaptedTrackStepSkipped,
    trackStepInteraction: analytics.trackStepInteraction
  };
}
