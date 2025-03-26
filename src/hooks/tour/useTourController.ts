
import { useState, useCallback, useEffect, KeyboardEvent } from 'react';
import { useToggle } from '@/patterns/hooks/useToggle';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useTourAnalytics } from './useTourAnalytics';
import { loadTourPathsForRoute } from './controller/tour-loader';
import { 
  saveTourProgress, 
  loadTourProgress, 
  clearTourProgress,
  markTourCompleted
} from './controller/tour-persistence';
import { 
  getVisibleSteps, 
  getCurrentStepData, 
  findTourPathById,
  processDynamicContent,
  updateStepContent
} from './controller/step-processor';
import { handleKeyNavigation } from './controller/key-navigation';

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
    const fetchTourPaths = async () => {
      const paths = await loadTourPathsForRoute(currentPathname);
      setTourPaths(paths);
    };

    fetchTourPaths();
  }, [currentPathname]);

  // Save and restore tour progress
  useEffect(() => {
    const progress = loadTourProgress();
    if (progress && progress.active) {
      const { pathId, step } = progress;
      if (tourPaths.some(path => path.id === pathId)) {
        setCurrentPath(pathId);
        setCurrentStep(step);
        toggleActive(true);
      }
    }
  }, [tourPaths, toggleActive]);

  useEffect(() => {
    if (isActive && currentPath) {
      saveTourProgress(currentPath, currentStep, isActive);
    }
  }, [isActive, currentPath, currentStep]);

  // Process dynamic content when steps change
  useEffect(() => {
    const processDynamicSteps = async () => {
      const currentPathData = findTourPathById(tourPaths, currentPath);
      if (currentPathData) {
        let filteredSteps = getVisibleSteps(currentPathData);
        
        // Process any dynamic content in the steps
        const processedSteps = await Promise.all(
          filteredSteps.map(async (step) => {
            return await processDynamicContent(step);
          })
        );
        
        setVisibleSteps(processedSteps);
      }
    };
    
    processDynamicSteps();
  }, [currentPath, tourPaths]);

  // Get the current path data
  const getCurrentPathData = useCallback((): TourPath | undefined => {
    return findTourPathById(tourPaths, currentPath);
  }, [tourPaths, currentPath]);

  // Start a tour
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

  // End a tour
  const endTour = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData) {
      // Determine if tour was completed or abandoned
      const wasCompleted = currentStep === visibleSteps.length - 1;
      
      if (wasCompleted) {
        analytics.trackTourCompleted(pathData, userId, userType);
        // Mark the tour as completed
        markTourCompleted(pathData.id);
      } else {
        analytics.trackTourAbandoned(pathData, currentStep, userId, userType);
      }
    }
    
    toggleActive(false);
    clearTourProgress();
  }, [toggleActive, getCurrentPathData, currentStep, visibleSteps.length, analytics, userId, userType]);

  // Go to next step
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

  // Go to previous step
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

  // Go to specific step
  const goToStep = useCallback((stepIndex: number) => {
    const pathData = getCurrentPathData();
    
    if (pathData && visibleSteps.length > 0 && stepIndex >= 0 && stepIndex < visibleSteps.length) {
      // Track jumping to a specific step
      const currentStepData = visibleSteps[currentStep];
      
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

  // Handle keyboard navigation
  const keyboardNavigationHandler = useCallback((event: KeyboardEvent) => {
    handleKeyNavigation(event, {
      isActive,
      currentPath,
      tourPaths,
      currentStep,
      visibleSteps,
      userId,
      userType,
      handlers: {
        nextStep,
        prevStep,
        endTour,
        trackInteraction: analytics.trackStepInteraction
      }
    });
  }, [isActive, currentPath, tourPaths, currentStep, visibleSteps, userId, userType, nextStep, prevStep, endTour, analytics.trackStepInteraction]);

  // Track step views
  useEffect(() => {
    if (isActive && currentPath) {
      const pathData = getCurrentPathData();
      const currentStepData = visibleSteps[currentStep];
      
      if (pathData && currentStepData) {
        analytics.trackStepViewed(pathData, currentStepData, currentStep, userId, userType);
      }
    }
  }, [isActive, currentPath, currentStep, visibleSteps, getCurrentPathData, analytics, userId, userType]);

  // Get current step data
  const getStepData = useCallback((): TourStep | null => {
    return getCurrentStepData(visibleSteps, currentStep);
  }, [visibleSteps, currentStep]);

  // Get total steps count
  const getTotalSteps = useCallback((): number => {
    return visibleSteps.length || 0;
  }, [visibleSteps]);

  // Set dynamic content for a specific step
  const setDynamicContent = useCallback((stepId: string, content: string) => {
    setVisibleSteps(prev => updateStepContent(prev, stepId, content));
    
    // Also update the original tour path to persist changes
    setTourPaths(prev => prev.map(path => {
      return {
        ...path,
        steps: path.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              content
            };
          }
          return step;
        })
      };
    }));
  }, []);

  return {
    isActive,
    currentPath,
    currentStep,
    totalSteps: getTotalSteps(),
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    currentStepData: getStepData(),
    availablePaths: tourPaths,
    handleKeyNavigation: keyboardNavigationHandler,
    visibleSteps,
    setDynamicContent,
  };
}
