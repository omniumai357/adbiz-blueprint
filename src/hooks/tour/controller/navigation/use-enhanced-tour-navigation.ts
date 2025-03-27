import { useCallback, useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tour';
import { useAuth } from '@/features/auth';
import { useTourAnalyticsTracking } from './use-tour-analytics-tracking';
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Enhanced hook for tour navigation with analytics tracking
 */
export const useEnhancedTourNavigation = () => {
  const { 
    isActive,
    currentStepData,
    currentPath,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    endTour,
    availablePaths
  } = useTour();
  
  // Get the current path data from availablePaths
  const currentPathData = currentPath ? availablePaths.find(path => 
    typeof currentPath === 'string' ? path.id === currentPath : path.id === currentPath.id
  ) : null;
  
  const { user } = useAuth();
  const { trackNavigation, trackStepCompletion, trackStepGoBack, trackStepJump, 
    trackTourSkip, trackTourComplete } = useTourAnalyticsTracking();
  
  // Keep track of the previous step for analytics
  const prevStepRef = useRef(currentStep);
  
  // Track analytics when step changes
  useEffect(() => {
    if (!isActive || !currentPathData || !currentStepData) return;
    
    const prevStepIndex = prevStepRef.current;
    
    // Skip the initial tracking when component mounts
    if (prevStepIndex !== currentStep && prevStepIndex !== -1) {
      if (currentStep > prevStepIndex) {
        // Forward navigation
        trackStepCompletion(
          currentPathData, 
          currentStepData, 
          currentStep,
          user?.id,
          user?.user_metadata?.user_type
        );
      } else {
        // Backward navigation
        trackStepGoBack(
          currentPathData, 
          currentStepData, 
          currentStep,
          user?.id,
          user?.user_metadata?.user_type
        );
      }
    }
    
    prevStepRef.current = currentStep;
  }, [currentStep, isActive, currentPathData, currentStepData, user?.id, user?.user_metadata?.user_type, 
      trackStepCompletion, trackStepGoBack]);
  
  // Enhanced navigation methods with analytics
  const handleNext = useCallback(() => {
    trackNavigation('next');
    nextStep();
  }, [nextStep, trackNavigation]);
  
  const handlePrev = useCallback(() => {
    trackNavigation('previous');
    prevStep();
  }, [prevStep, trackNavigation]);
  
  const handleSkip = useCallback(() => {
    if (currentPathData && currentStepData) {
      trackTourSkip(
        currentPathData,
        currentStepData,
        currentStep,
        user?.id,
        user?.user_metadata?.user_type
      );
    }
    trackNavigation('skip');
    endTour();
  }, [endTour, currentPathData, currentStepData, currentStep, user?.id, user?.user_metadata?.user_type, 
      trackNavigation, trackTourSkip]);
  
  const handleJumpToStep = useCallback((step: number) => {
    if (currentPathData && currentStepData) {
      trackStepJump(
        currentPathData,
        currentStepData,
        currentStep,
        step,
        user?.id,
        user?.user_metadata?.user_type
      );
    }
    trackNavigation(`jump_to_${step}`);
    goToStep(step);
  }, [goToStep, currentPathData, currentStepData, currentStep, user?.id, user?.user_metadata?.user_type, 
      trackNavigation, trackStepJump]);
  
  const handleComplete = useCallback(() => {
    if (currentPathData) {
      trackTourComplete(
        currentPathData,
        user?.id,
        user?.user_metadata?.user_type
      );
    }
    trackNavigation('complete');
    endTour();
  }, [endTour, currentPathData, user?.id, user?.user_metadata?.user_type, 
      trackNavigation, trackTourComplete]);
  
  return {
    handleNext,
    handlePrev,
    handleSkip,
    handleJumpToStep,
    handleComplete
  };
};
