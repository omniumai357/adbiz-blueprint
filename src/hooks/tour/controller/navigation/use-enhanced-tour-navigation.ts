
import { useState, useCallback, useEffect } from 'react';
import { useTour } from '@/contexts/tour';
import { useTourAnalytics } from '@/hooks/tour/useTourAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/features/auth/types';

export const useEnhancedTourNavigation = () => {
  const {
    isActive,
    currentPath,
    currentPathData,
    currentStep,
    currentStepData,
    totalSteps,
    nextStep: baseNextStep,
    prevStep: basePrevStep,
    endTour: baseEndTour,
  } = useTour();
  
  const [user, setUser] = useState<User | null>(null);
  const analytics = useTourAnalytics();
  
  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    
    getUser();
  }, []);
  
  // Enhanced next step with analytics
  const nextStep = useCallback(() => {
    if (isActive && currentPath && currentPathData && currentStepData) {
      // Track step navigation
      analytics.trackStepNavigation({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        direction: 'next',
        totalSteps: totalSteps,
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
      
      // Check if this is the last step
      if (currentStep === totalSteps - 1) {
        // Track tour completed
        analytics.trackTourCompleted({
          pathId: currentPath,
          tourId: currentPathData.id,
          tourName: currentPathData.name,
          totalSteps: totalSteps,
          userId: user?.id || 'anonymous',
          userType: user?.type || 'guest',
          metadata: {}
        });
      }
      
      // Proceed with base next step
      baseNextStep();
    }
  }, [isActive, currentPath, currentPathData, currentStep, currentStepData, totalSteps, analytics, baseNextStep, user]);
  
  // Enhanced previous step with analytics
  const prevStep = useCallback(() => {
    if (isActive && currentPath && currentPathData && currentStepData) {
      // Track step navigation
      analytics.trackStepNavigation({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        direction: 'prev',
        totalSteps: totalSteps,
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
      
      // Proceed with base prev step
      basePrevStep();
    }
  }, [isActive, currentPath, currentPathData, currentStep, currentStepData, totalSteps, analytics, basePrevStep, user]);
  
  // Enhanced end tour with analytics
  const endTour = useCallback(() => {
    if (isActive && currentPath && currentPathData && currentStepData) {
      // Track tour exited
      analytics.trackTourExited({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        totalSteps: totalSteps,
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
      
      // Track specific exit event
      analytics.trackCustomEvent('tour_exit_manual', {
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        currentStepIndex: currentStep,
        totalSteps: totalSteps,
        sessionId: analytics.getSessionId(),
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
      
      // Proceed with base end tour
      baseEndTour();
    }
  }, [isActive, currentPath, currentPathData, currentStep, currentStepData, totalSteps, analytics, baseEndTour, user]);
  
  return {
    nextStep,
    prevStep,
    endTour
  };
};
