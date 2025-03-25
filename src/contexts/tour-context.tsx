
import React, { createContext, useContext, useState, useEffect } from "react";

type TourStep = {
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
  const [isActive, setIsActive] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPaths, setTourPaths] = useState<TourPath[]>([]);
  
  // Load tour paths based on the current route
  useEffect(() => {
    const loadTourPaths = async () => {
      const pathname = currentPathname;
      
      // Load path-specific tours
      if (pathname.includes("/services")) {
        const { servicesTourPath } = await import("../lib/tour/services-tour");
        setTourPaths([servicesTourPath]);
      } else if (pathname === "/") {
        const { homeTourPath } = await import("../lib/tour/home-tour");
        setTourPaths([homeTourPath]);
      } else if (pathname.includes("/contact")) {
        const { contactTourPath } = await import("../lib/tour/contact-tour");
        setTourPaths([contactTourPath]);
      } else {
        // Default tour for any other page
        const { defaultTourPath } = await import("../lib/tour/default-tour");
        setTourPaths([defaultTourPath]);
      }
    };

    loadTourPaths();
  }, [currentPathname]);

  // Save and restore tour progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("tourProgress");
    if (savedProgress) {
      const { pathId, step, active } = JSON.parse(savedProgress);
      if (active && tourPaths.some(path => path.id === pathId)) {
        setCurrentPath(pathId);
        setCurrentStep(step);
        setIsActive(true);
      }
    }
  }, [tourPaths]);

  useEffect(() => {
    if (isActive && currentPath) {
      localStorage.setItem(
        "tourProgress",
        JSON.stringify({
          pathId: currentPath,
          step: currentStep,
          active: isActive,
        })
      );
    }
  }, [isActive, currentPath, currentStep]);

  const getCurrentPathData = (): TourPath | undefined => {
    return tourPaths.find((path) => path.id === currentPath);
  };

  const startTour = (pathId: string) => {
    const pathExists = tourPaths.some((path) => path.id === pathId);
    if (pathExists) {
      setCurrentPath(pathId);
      setCurrentStep(0);
      setIsActive(true);
    }
  };

  const endTour = () => {
    setIsActive(false);
    localStorage.removeItem("tourProgress");
  };

  const nextStep = () => {
    const pathData = getCurrentPathData();
    if (pathData && currentStep < pathData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    const pathData = getCurrentPathData();
    if (pathData && stepIndex >= 0 && stepIndex < pathData.steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const currentStepData = (() => {
    const pathData = getCurrentPathData();
    return pathData && isActive ? pathData.steps[currentStep] : null;
  })();

  const totalSteps = getCurrentPathData()?.steps.length || 0;

  const value = {
    isActive,
    currentPath,
    currentStep,
    totalSteps,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    currentStepData,
    availablePaths: tourPaths,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
