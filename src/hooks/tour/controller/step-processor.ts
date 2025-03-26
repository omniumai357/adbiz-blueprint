
import { TourStep, TourPath } from '@/contexts/tour-context';

/**
 * Filters tour steps based on conditions
 * @param tourPath The tour path to filter steps for
 * @returns Array of visible steps after filtering
 */
export const getVisibleSteps = (tourPath: TourPath | undefined): TourStep[] => {
  if (!tourPath) return [];
  
  return tourPath.steps.filter(step => {
    // If the step has a condition function, evaluate it
    if (step.condition && typeof step.condition === 'function') {
      return step.condition();
    }
    // If no condition is specified, always show the step
    return true;
  });
};

/**
 * Gets the current step data
 * @param visibleSteps Array of visible steps
 * @param currentStep Current step index
 * @returns The current step data or null
 */
export const getCurrentStepData = (
  visibleSteps: TourStep[],
  currentStep: number
): TourStep | null => {
  return visibleSteps[currentStep] || null;
};

/**
 * Finds a tour path by ID
 * @param tourPaths Available tour paths
 * @param pathId The tour path ID to find
 * @returns The found tour path or undefined
 */
export const findTourPathById = (
  tourPaths: TourPath[],
  pathId: string | null
): TourPath | undefined => {
  if (!pathId) return undefined;
  return tourPaths.find((path) => path.id === pathId);
};
