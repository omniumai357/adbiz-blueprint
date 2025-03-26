
import React, { createContext, useContext, useEffect } from "react";
import { useTourController } from "@/hooks/tour/useTourController";
import { useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useAuth } from "@/contexts/auth-context";

export type StepConditionFn = () => boolean;

export type StepAnimation = {
  entry?: string;
  exit?: string;
  highlight?: string;
};

export type StepTrigger = {
  event?: string;
  elementId?: string;
  action?: string;
  delay?: number;
};

export type StepUserRole = "anonymous" | "user" | "admin" | string;

export type TourStep = {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  condition?: StepConditionFn;
  animation?: StepAnimation;
  isOptional?: boolean;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
  };
  actions?: {
    next?: {
      label?: string;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      onClick?: () => void;
    };
  };
  userRoles?: StepUserRole[];
  triggers?: StepTrigger[];
  priority?: number;
  metadata?: Record<string, any>;
};

export type TourPath = {
  id: string;
  name: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  requiredUserRoles?: StepUserRole[];
  completionCallback?: () => void;
  metadata?: Record<string, any>;
};

type TourContextType = {
  isActive: boolean;
  currentPath: string | null;
  currentStep: number;
  totalSteps: number;
  startTour: (pathId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  currentStepData: TourStep | null;
  availablePaths: TourPath[];
  handleKeyNavigation: (event: React.KeyboardEvent) => void;
  visibleSteps: TourStep[];
};

const defaultContext: TourContextType = {
  isActive: false,
  currentPath: null,
  currentStep: 0,
  totalSteps: 0,
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  currentStepData: null,
  availablePaths: [],
  handleKeyNavigation: () => {},
  visibleSteps: [],
};

const TourContext = createContext<TourContextType>(defaultContext);

export const useTour = () => useContext(TourContext);

export const TourProvider: React.FC<{ 
  children: React.ReactNode;
  currentPathname?: string;
}> = ({ children, currentPathname }) => {
  const location = useLocation();
  const pathname = currentPathname || location.pathname;
  
  // Try to get user information from the auth context first
  let userId: string | undefined;
  let userType: string | undefined;
  
  try {
    // Use the auth context if available
    const { user, profile } = useAuth();
    userId = user?.id;
    userType = profile?.role || 'anonymous';
  } catch (error) {
    // Fallback to useAuthUser if auth context isn't available
    const { data: authData } = useAuthUser();
    userId = authData?.user?.id;
    userType = 'anonymous'; // Default user type when profile isn't available
  }
  
  // Use our hook to manage tour state with user context for analytics
  const tourController = useTourController([], pathname, userId, userType);
  
  return <TourContext.Provider value={tourController}>{children}</TourContext.Provider>;
};
