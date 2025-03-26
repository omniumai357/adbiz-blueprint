
import React, { createContext, useContext, useEffect } from "react";
import { useTourController } from "@/hooks/tour/useTourController";
import { useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/queries/useAuthUser";

export type StepConditionFn = () => boolean;

export type StepAnimation = {
  entry?: string;
  exit?: string;
  highlight?: string;
};

export type TourStep = {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  condition?: StepConditionFn;
  animation?: StepAnimation;
  isOptional?: boolean;
};

export type TourPath = {
  id: string;
  name: string;
  steps: TourStep[];
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
  const { data: authData } = useAuthUser();
  
  // Get user information for analytics
  const userId = authData?.user?.id;
  const userType = authData?.profile?.role || 'anonymous';
  
  // Use our hook to manage tour state with user context for analytics
  const tourController = useTourController([], pathname, userId, userType);
  
  return <TourContext.Provider value={tourController}>{children}</TourContext.Provider>;
};
