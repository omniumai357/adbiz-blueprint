
import { useState, useCallback, useEffect, KeyboardEvent } from 'react';
import { useToggle } from '@/patterns/hooks/useToggle';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useTourAnalytics } from './useTourAnalytics';

/**
 * Custom hook for managing tour state and navigation
 * 
 * @param initialPaths Available tour paths
 * @param currentPathname Current application route for context-aware tours
 * @returns Object with tour state and control functions
 */
export function useTourController(
  initialPaths: TourPath[] = [],
  currentPathname: string = '/',
  userId?: string,
  userType?: string
) {
  // Use the existing useToggle hook for active state
  const [isActive, toggle] = useToggle(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPaths, setTourPaths] = useState<TourPath[]>(initialPaths);
  const [visibleSteps, setVisibleSteps] = useState<TourStep[]>([]);
  
  // Integrate analytics tracking
  const analytics = useTourAnalytics();
  
  // Toggle active state with explicit boolean
  const toggleActive = useCallback((state?: boolean) => {
    if (typeof state === 'boolean') {
      if (state !== isActive) {
        toggle();
      }
    } else {
      toggle();
    }
  }, [isActive, toggle]);
  
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

  // Filter steps based on conditional logic
  useEffect(() => {
    const currentPathData = getCurrentPathData();
    if (currentPathData) {
      const filteredSteps = currentPathData.steps.filter(step => {
        // If the step has a condition function, evaluate it
        if (step.condition && typeof step.condition === 'function') {
          return step.condition();
        }
        // If no condition is specified, always show the step
        return true;
      });
      setVisibleSteps(filteredSteps);
    }
  }, [currentPath, tourPaths]);

  const getCurrentPathData = useCallback((): TourPath | undefined => {
    return tourPaths.find((path) => path.id === currentPath);
  }, [tourPaths, currentPath]);

  const startTour = useCallback((pathId: string) => {
    const pathData = tourPaths.find((path) => path.id === pathId);
    const pathExists = !!pathData;
    
    if (pathExists && pathData) {
      setCurrentPath(pathId);
      setCurrentStep(0);
      toggleActive(true);
      
      // Track tour start
      analytics.trackTourStarted(pathData, userId, userType);
    }
  }, [tourPaths, toggleActive, analytics, userId, userType]);

  const endTour = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData) {
      // Determine if tour was completed or abandoned
      const wasCompleted = currentStep === visibleSteps.length - 1;
      
      if (wasCompleted) {
        analytics.trackTourCompleted(pathData, userId, userType);
      } else {
        analytics.trackTourAbandoned(pathData, currentStep, userId, userType);
      }
    }
    
    toggleActive(false);
    localStorage.removeItem("tourProgress");
  }, [toggleActive, getCurrentPathData, currentStep, visibleSteps.length, analytics, userId, userType]);

  const nextStep = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData && visibleSteps.length > 0) {
      // If current step is NOT the last step
      if (currentStep < visibleSteps.length - 1) {
        // Track the user skipping the current step
        const currentStepData = visibleSteps[currentStep];
        analytics.trackStepSkipped(pathData, currentStepData, currentStep, userId, userType);
        
        // Move to next step
        setCurrentStep(currentStep => currentStep + 1);
      } else {
        // End the tour if we're on the last step
        endTour();
      }
    }
  }, [visibleSteps, currentStep, endTour, getCurrentPathData, analytics, userId, userType]);

  const prevStep = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData && currentStep > 0) {
      // Track going back to the previous step
      const currentStepData = visibleSteps[currentStep];
      analytics.trackStepInteraction(
        pathData, 
        currentStepData, 
        currentStep, 
        'go_back', 
        userId, 
        userType
      );
      
      // Move to previous step
      setCurrentStep(currentStep => currentStep - 1);
    }
  }, [currentStep, getCurrentPathData, visibleSteps, analytics, userId, userType]);

  const goToStep = useCallback((stepIndex: number) => {
    const pathData = getCurrentPathData();
    
    if (pathData && visibleSteps.length > 0 && stepIndex >= 0 && stepIndex < visibleSteps.length) {
      // Track jumping to a specific step
      const currentStepData = visibleSteps[currentStep];
      const targetStepData = visibleSteps[stepIndex];
      
      analytics.trackStepInteraction(
        pathData, 
        currentStepData, 
        currentStep, 
        `jump_to_step_${stepIndex}`, 
        userId, 
        userType
      );
      
      // Set the new step
      setCurrentStep(stepIndex);
    }
  }, [visibleSteps, currentStep, getCurrentPathData, analytics, userId, userType]);

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    
    const pathData = getCurrentPathData();
    if (!pathData) return;
    
    const currentStepData = visibleSteps[currentStep];
    if (!currentStepData) return;
    
    switch(event.key) {
      case 'ArrowRight':
      case 'Enter':
        analytics.trackStepInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_${event.key}`,
          userId,
          userType
        );
        nextStep();
        break;
      case 'ArrowLeft':
        analytics.trackStepInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_${event.key}`,
          userId,
          userType
        );
        prevStep();
        break;
      case 'Escape':
        analytics.trackStepInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_${event.key}`,
          userId,
          userType
        );
        endTour();
        break;
      default:
        break;
    }
  }, [isActive, nextStep, prevStep, endTour, getCurrentPathData, visibleSteps, currentStep, analytics, userId, userType]);

  // Track when a step is viewed
  useEffect(() => {
    if (isActive && currentPath) {
      const pathData = getCurrentPathData();
      const currentStepData = visibleSteps[currentStep];
      
      if (pathData && currentStepData) {
        analytics.trackStepViewed(pathData, currentStepData, currentStep, userId, userType);
      }
    }
  }, [isActive, currentPath, currentStep, visibleSteps, getCurrentPathData, analytics, userId, userType]);

  const currentStepData = useCallback((): TourStep | null => {
    return visibleSteps[currentStep] || null;
  }, [visibleSteps, currentStep]);

  const totalSteps = useCallback((): number => {
    return visibleSteps.length || 0;
  }, [visibleSteps]);

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
    handleKeyNavigation,
    visibleSteps,
  };
}
