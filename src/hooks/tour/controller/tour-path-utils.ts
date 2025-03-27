
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
