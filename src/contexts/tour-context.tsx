
import React, { createContext, useContext } from "react";
import { useTourController } from "@/hooks/tour/useTourController";

export type TourStep = {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
};

type TourPath = {
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
};

const TourContext = createContext<TourContextType>(defaultContext);

export const useTour = () => useContext(TourContext);

export const TourProvider: React.FC<{ 
  children: React.ReactNode;
  currentPathname?: string;
}> = ({ children, currentPathname = "/" }) => {
  // Use our new hook to manage tour state
  const tourController = useTourController([], currentPathname);
  
  return <TourContext.Provider value={tourController}>{children}</TourContext.Provider>;
};
