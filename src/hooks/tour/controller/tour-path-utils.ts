
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Gets the steps for a specific tour path
 */
export const getTourPathSteps = (path: TourPath): TourStep[] => {
  if (!path || !Array.isArray(path.steps)) {
    return [];
  }
  return path.steps;
};

/**
 * Converts a tour path to an array of steps
 */
export const tourPathToSteps = (path: TourPath): TourStep[] => {
  return path.steps || [];
};

/**
 * Adapter to convert between different tour step formats used in different parts of the application
 */
export const adaptTourStepsFormat = (steps: any[]): TourStep[] => {
  if (!Array.isArray(steps)) return [];
  return steps.map(step => ({
    ...step,
    // Ensure condition is compatible with both formats
    condition: typeof step.condition === 'function' 
      ? (state: any) => step.condition(state)
      : () => true
  }));
};
