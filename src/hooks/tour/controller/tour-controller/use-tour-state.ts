
import { useState, useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { findTourPathById, getVisibleSteps } from '../step-processor';

/**
 * Hook to manage tour state
 */
export function useTourState(initialPaths: TourPath[] = []) {
  const [isActive, setIsActive] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPaths, setTourPaths] = useState<TourPath[]>(initialPaths);
  const [visibleSteps, setVisibleSteps] = useState<TourStep[]>([]);

  // Toggle active state with explicit boolean
  const toggleActive = useCallback((state?: boolean) => {
    if (typeof state === 'boolean') {
      setIsActive(state);
    } else {
      setIsActive(prev => !prev);
    }
  }, []);

  // Get the current path data
  const getCurrentPathData = useCallback((): TourPath | undefined => {
    return findTourPathById(tourPaths, currentPath);
  }, [tourPaths, currentPath]);

  return {
    isActive,
    currentPath,
    currentStep,
    tourPaths,
    visibleSteps,
    setIsActive,
    toggleActive,
    setCurrentPath,
    setCurrentStep,
    setTourPaths,
    setVisibleSteps,
    getCurrentPathData
  };
}
