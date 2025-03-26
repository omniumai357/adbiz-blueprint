import { useState, useCallback, useEffect } from 'react';
import { useToggle } from '@/patterns/hooks/useToggle';
import { TourPath, TourStep } from '@/contexts/tour-context';

/**
 * Custom hook for managing tour state and navigation
 * 
 * @param initialPaths Available tour paths
 * @param currentPathname Current application route for context-aware tours
 * @returns Object with tour state and control functions
 */
export function useTourController(
  initialPaths: TourPath[] = [],
  currentPathname: string = '/'
) {
  // Use the existing useToggle hook for active state
  const [isActive, toggleActive] = useToggle(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPaths, setTourPaths] = useState<TourPath[]>(initialPaths);
  
  // Load path-specific tours based on current route
  useEffect(() => {
    const loadTourPaths = async () => {
      const pathname = currentPathname;
      
      // Load path-specific tours
      if (pathname.includes("/services")) {
        const { servicesTourPath } = await import("@/lib/tour/services-tour");
        setTourPaths([servicesTourPath]);
      } else if (pathname === "/") {
        const { homeTourPath } = await import("@/lib/tour/home-tour");
        setTourPaths([homeTourPath]);
      } else if (pathname.includes("/contact")) {
        const { contactTourPath } = await import("@/lib/tour/contact-tour");
        setTourPaths([contactTourPath]);
      } else if (pathname.includes("/checkout")) {
        const { checkoutTourPath } = await import("@/lib/tour/checkout-tour");
        setTourPaths([checkoutTourPath]);
      } else {
        // Default tour for any other page
        const { defaultTourPath } = await import("@/lib/tour/default-tour");
        setTourPaths([defaultTourPath]);
      }
    };

    loadTourPaths();
  }, [currentPathname]);

  // Save and restore tour progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("tourProgress");
    if (savedProgress) {
      try {
        const { pathId, step, active } = JSON.parse(savedProgress);
        if (active && tourPaths.some(path => path.id === pathId)) {
          setCurrentPath(pathId);
          setCurrentStep(step);
          toggleActive(true);
        }
      } catch (error) {
        console.error("Error restoring tour progress:", error);
      }
    }
  }, [tourPaths, toggleActive]);

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

  const getCurrentPathData = useCallback((): TourPath | undefined => {
    return tourPaths.find((path) => path.id === currentPath);
  }, [tourPaths, currentPath]);

  const startTour = useCallback((pathId: string) => {
    const pathExists = tourPaths.some((path) => path.id === pathId);
    if (pathExists) {
      setCurrentPath(pathId);
      setCurrentStep(0);
      toggleActive(true);
    }
  }, [tourPaths, toggleActive]);

  const endTour = useCallback(() => {
    toggleActive(false);
    localStorage.removeItem("tourProgress");
  }, [toggleActive]);

  const nextStep = useCallback(() => {
    const pathData = getCurrentPathData();
    if (pathData && currentStep < pathData.steps.length - 1) {
      setCurrentStep(currentStep => currentStep + 1);
    } else {
      endTour();
    }
  }, [getCurrentPathData, currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep => currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    const pathData = getCurrentPathData();
    if (pathData && stepIndex >= 0 && stepIndex < pathData.steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [getCurrentPathData]);

  const currentStepData = useCallback((): TourStep | null => {
    const pathData = getCurrentPathData();
    return pathData && isActive ? pathData.steps[currentStep] : null;
  }, [getCurrentPathData, isActive, currentStep]);

  const totalSteps = useCallback((): number => {
    const pathData = getCurrentPathData();
    return pathData?.steps.length || 0;
  }, [getCurrentPathData]);

  return {
    isActive,
    currentPath,
    currentStep,
    totalSteps: totalSteps(),
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    currentStepData: currentStepData(),
    availablePaths: tourPaths,
  };
}
