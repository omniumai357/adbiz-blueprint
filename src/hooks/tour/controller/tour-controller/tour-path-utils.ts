
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Convert a TourPath to an array of TourStep
 */
export const tourPathToStepsArray = (path: TourPath): TourStep[] => {
  if (!path || !Array.isArray(path.steps)) {
    return [];
  }
  return path.steps;
};

/**
 * Safely get tour path steps
 */
export const getTourPathSteps = (path: TourPath | TourStep[] | null): TourStep[] => {
  if (!path) return [];
  
  if (Array.isArray(path)) {
    return path;
  }
  
  return tourPathToStepsArray(path);
};
