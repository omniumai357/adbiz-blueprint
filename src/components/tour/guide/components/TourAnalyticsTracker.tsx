
import React, { useEffect } from 'react';
import { useTourAnalytics } from '@/hooks/tour/useTourAnalytics';
import { useTour } from '@/contexts/tour';
import { supabase } from '@/integrations/supabase/client';

// Import User type directly
import { User } from '@/features/auth/types';

// Define extended analytics with additional methods
interface ExtendedAnalytics {
  trackTourStarted: (data: { pathId: string; tourId: string; tourName: string; }) => boolean;
  trackTourCompleted: (data: { pathId: string; tourId: string; tourName: string; totalSteps: number; userId: string; userType: string; metadata: Record<string, any>; }) => boolean;
  trackTourExited: (data: { pathId: string; tourId: string; tourName: string; stepId: string; stepIndex: number; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackTourPaused: (data: { pathId: string; tourId: string; tourName: string; stepId: string; stepIndex: number; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackStepNavigation: (data: { pathId: string; tourId: string; tourName: string; stepId: string; stepIndex: number; direction: 'next' | 'prev'; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackStepView: (data: { pathId: string; tourId: string; tourName: string; stepId: string; stepIndex: number; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackTourView: (data: { pathId: string; tourId: string; tourName: string; userId: string; userType: string; }) => boolean;
  trackStepImpression: (data: { pathId: string; tourId: string; tourName: string; stepId: string; stepIndex: number; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackActionClick: (data: { pathId: string; tourId: string; tourName: string; stepId: string; actionId: string; stepIndex: number; totalSteps: number; userId: string; userType: string; }) => boolean;
  trackCustomEvent: (eventName: string, data: Record<string, any>) => boolean;
  getSessionId: () => string;
  exportAnalyticsAsJson: () => void;
}

export const TourAnalyticsTracker: React.FC = () => {
  const analytics = useTourAnalytics() as ExtendedAnalytics;
  const { isActive, currentPath, currentPathData, currentStep, currentStepData } = useTour();
  const [user, setUser] = React.useState<User | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    
    getUser();
  }, []);
  
  // Track when a tour becomes active
  useEffect(() => {
    if (isActive && currentPath && currentPathData) {
      // Track tour view
      analytics.trackTourView({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
      
      // Track tour started
      analytics.trackTourStarted({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name
      });
    }
  }, [isActive, currentPath, currentPathData, analytics, user]);
  
  // Track when step changes
  useEffect(() => {
    if (isActive && currentPath && currentPathData && currentStepData) {
      // Track step impression
      analytics.trackStepImpression({
        pathId: currentPath,
        tourId: currentPathData.id,
        tourName: currentPathData.name,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        totalSteps: currentPathData.steps.length,
        userId: user?.id || 'anonymous',
        userType: user?.type || 'guest'
      });
    }
  }, [isActive, currentPath, currentPathData, currentStep, currentStepData, analytics, user]);
  
  return null;
};
