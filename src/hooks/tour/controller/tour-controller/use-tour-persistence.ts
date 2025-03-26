
import { useEffect, useCallback } from 'react';
import { TourPath } from '@/contexts/tour-context';
import { 
  saveTourProgress, 
  loadTourProgress, 
  clearTourProgress,
  markTourCompleted
} from '../tour-persistence';

/**
 * Hook to handle tour persistence
 */
export function useTourPersistence(
  isActive: boolean,
  currentPath: string | null,
  currentStep: number,
  tourPaths: TourPath[],
  setCurrentPath: (path: string) => void,
  setCurrentStep: (step: number) => void,
  toggleActive: (state?: boolean) => void
) {
  // Save tour progress
  useEffect(() => {
    if (isActive && currentPath) {
      saveTourProgress(currentPath, currentStep, isActive);
    }
  }, [isActive, currentPath, currentStep]);

  // Load saved tour progress
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
  }, [tourPaths, toggleActive, setCurrentPath, setCurrentStep]);

  // Function to end a tour and handle persistence
  const endAndCleanupTour = useCallback(() => {
    toggleActive(false);
    clearTourProgress();
  }, [toggleActive]);

  // Mark tour as completed
  const markCurrentTourCompleted = useCallback(() => {
    if (currentPath) {
      markTourCompleted(currentPath);
    }
  }, [currentPath]);

  return {
    endAndCleanupTour,
    markCurrentTourCompleted
  };
}
