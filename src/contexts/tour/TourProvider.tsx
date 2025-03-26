
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTourController } from '@/hooks/tour/useTourController';
import { useAuthUser } from '@/hooks/queries/useAuthUser';
import { useAuth } from '@/contexts/auth-context';
import { TourContext } from './TourContext';
import { TourAnnouncer } from './TourAnnouncer';
import { PathOptions } from '@/lib/utils/path-utils';

interface TourProviderProps {
  children: React.ReactNode;
  currentPathname?: string;
}

export const TourProvider: React.FC<TourProviderProps> = ({ 
  children,
  currentPathname
}) => {
  const location = useLocation();
  const pathname = currentPathname || location.pathname;
  
  let userId: string | undefined;
  let userType: string | undefined;
  
  try {
    const { user, profile } = useAuth();
    userId = user?.id;
    userType = profile?.role || 'anonymous';
  } catch (error) {
    const { data: authData } = useAuthUser();
    userId = authData?.user?.id;
    userType = 'anonymous';
  }
  
  const tourController = useTourController([], pathname, userId, userType);
  
  return (
    <TourContext.Provider value={tourController}>
      <TourAnnouncer 
        isActive={tourController.isActive}
        currentStepData={tourController.currentStepData}
        currentStep={tourController.currentStep}
        totalSteps={tourController.totalSteps}
      />
      {children}
    </TourContext.Provider>
  );
};
