
import React, { useEffect } from 'react';
import { useTour } from '@/contexts/tour';
import { useTourAnalytics } from '@/hooks/tour/useTourAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/features/auth/types';

export const TourEventManager: React.FC = () => {
  const { isActive, currentPath, currentPathData, endTour } = useTour();
  const analytics = useTourAnalytics();
  const [user, setUser] = React.useState<User | null>(null);
  
  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    
    getUser();
  }, []);
  
  // Listen for escape key to exit tour
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        // Track tour exited via escape key
        if (currentPath && currentPathData) {
          analytics.trackTourExited({
            pathId: currentPath,
            tourId: currentPathData.id,
            tourName: currentPathData.name,
            stepId: 'escape-key',
            stepIndex: -1,
            totalSteps: currentPathData.steps.length,
            userId: user?.id || 'anonymous',
            userType: user?.type || 'guest'
          });
          
          // Track specific exit event
          analytics.trackCustomEvent('tour_exit_escape_key', {
            pathId: currentPath,
            tourId: currentPathData.id,
            tourName: currentPathData.name,
            sessionId: analytics.getSessionId(),
            userId: user?.id || 'anonymous',
            userType: user?.type || 'guest'
          });
        }
        
        endTour();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentPath, currentPathData, endTour, analytics, user]);
  
  return null;
};
