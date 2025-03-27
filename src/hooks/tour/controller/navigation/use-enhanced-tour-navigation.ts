
import { useCallback } from 'react';
import { useTour } from '@/contexts/tour';
import { useAuth } from '@/features/auth';
import { useTourAnalytics } from '../../useTourAnalytics';

interface ExtendedAnalytics extends ReturnType<typeof useTourAnalytics> {
  trackTourExited: (data: any) => boolean;
}

export const useEnhancedTourNavigation = () => {
  const {
    isActive,
    currentStep,
    totalSteps,
    nextStep: baseNextStep,
    prevStep: basePrevStep,
    endTour: baseEndTour,
    goToStep: baseGoToStep,
    currentPathData,
    currentStepData,
  } = useTour();

  const { user } = useAuth();
  const analytics = useTourAnalytics() as ExtendedAnalytics;

  // Enhanced next step with analytics
  const nextStep = useCallback(() => {
    if (!isActive || !currentPathData || !currentStepData) {
      baseNextStep();
      return;
    }

    // Track interaction
    analytics.trackInteraction('next', {
      pathId: currentPathData.id,
      tourId: currentPathData.id,
      tourName: currentPathData.name || '',
      stepId: currentStepData.id,
      stepIndex: currentStep,
      totalSteps: totalSteps,
      userId: user?.id || '',
      userType: user?.type || ''
    });

    baseNextStep();
  }, [isActive, currentPathData, currentStepData, currentStep, totalSteps, baseNextStep, analytics, user?.id, user?.type]);

  // Enhanced previous step with analytics
  const prevStep = useCallback(() => {
    if (!isActive || !currentPathData || !currentStepData) {
      basePrevStep();
      return;
    }

    // Track interaction
    analytics.trackInteraction('prev', {
      pathId: currentPathData.id,
      tourId: currentPathData.id,
      tourName: currentPathData.name || '',
      stepId: currentStepData.id,
      stepIndex: currentStep,
      totalSteps: totalSteps,
      userId: user?.id || '',
      userType: user?.type || ''
    });

    basePrevStep();
  }, [isActive, currentPathData, currentStepData, currentStep, totalSteps, basePrevStep, analytics, user?.id, user?.type]);

  // Enhanced end tour with analytics
  const endTour = useCallback(() => {
    if (!isActive || !currentPathData || !currentStepData) {
      baseEndTour();
      return;
    }

    // Track exit
    analytics.trackTourExited({
      pathId: currentPathData.id,
      tourId: currentPathData.id,
      tourName: currentPathData.name || '',
      stepId: currentStepData.id,
      stepIndex: currentStep,
      totalSteps: totalSteps,
      reason: 'user_closed',
      userId: user?.id || '',
      userType: user?.type || ''
    });

    baseEndTour();
  }, [isActive, currentPathData, currentStepData, currentStep, totalSteps, baseEndTour, analytics, user?.id, user?.type]);

  // Enhanced go to step with analytics
  const goToStep = useCallback((stepIndex: number) => {
    if (!isActive || !currentPathData || !currentStepData) {
      baseGoToStep(stepIndex);
      return;
    }

    // Track interaction
    analytics.trackInteraction('go_to_step', {
      pathId: currentPathData.id,
      tourId: currentPathData.id,
      tourName: currentPathData.name || '',
      stepId: currentStepData.id,
      currentStepIndex: currentStep,
      targetStepIndex: stepIndex,
      totalSteps: totalSteps,
      userId: user?.id || '',
      userType: user?.type || ''
    });

    baseGoToStep(stepIndex);
  }, [isActive, currentPathData, currentStepData, currentStep, totalSteps, baseGoToStep, analytics, user?.id, user?.type]);

  return {
    nextStep,
    prevStep,
    endTour,
    goToStep,
  };
};
