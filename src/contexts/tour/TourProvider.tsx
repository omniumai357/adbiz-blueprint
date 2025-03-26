import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTourController } from '@/hooks/tour/useTourController';
import { useAuthUser } from '@/hooks/queries/useAuthUser';
import { useAuth } from '@/contexts/auth-context';
import { TourContext } from './TourContext';
import { TourAnnouncer } from './TourAnnouncer';
import { TourThemeName } from '@/lib/tour/types/theme';
import { defaultContext } from './defaults';
import { TourContextType, TourPath } from './types';

interface TourProviderProps {
  children: React.ReactNode;
  currentPathname?: string;
  theme?: TourThemeName;
}

export const TourProvider: React.FC<TourProviderProps> = ({ 
  children,
  currentPathname,
  theme = "default"
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

  // Add a custom config state for theme handling
  const [customConfig, setCustomConfig] = useState({
    theme: theme || "default"
  });
  
  const tourController = useTourController([], pathname, userId, userType);
  
  // Set initial theme if provided
  useEffect(() => {
    if (theme !== "default") {
      document.documentElement.classList.add(`tour-theme-${theme}`);
      
      // Update the theme in custom config
      setCustomConfig(prev => ({
        ...prev,
        theme
      }));
    }
    
    // Cleanup theme classes on unmount
    return () => {
      document.documentElement.classList.remove(
        "tour-theme-blue",
        "tour-theme-purple", 
        "tour-theme-green",
        "tour-theme-amber"
      );
    };
  }, [theme]);
  
  // Adapt the tour controller to match the TourContextType
  const adaptedController: TourContextType = {
    ...defaultContext,
    ...tourController,
    customConfig,
    setCustomConfig,
    // Make sure currentPath is a TourPath object
    currentPath: tourController.currentPath ? 
      (typeof tourController.currentPath === 'string' ? 
        tourController.availablePaths.find(p => p.id === tourController.currentPath) || null : 
        tourController.currentPath) : 
      null,
    // Make sure setDynamicContent has the correct signature
    setDynamicContent: (content: string) => {
      if (typeof tourController.setDynamicContent === 'function') {
        // If the original function takes two args, we'll pass the current step id as first arg
        if (tourController.setDynamicContent.length > 1 && tourController.currentStepData) {
          tourController.setDynamicContent(tourController.currentStepData.id, content);
        } else {
          // Otherwise just pass the content
          tourController.setDynamicContent(content);
        }
      }
    }
  };
  
  return (
    <TourContext.Provider value={adaptedController}>
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
