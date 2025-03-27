
import { createTourPath } from './createTourPath';
import { TourStep, TourPath, TourStepGroup } from '../../types';

/**
 * Creates a tour path from an array of step groups
 * This allows organizing steps into logical sections
 * 
 * @param stepGroups Array of step groups
 * @returns A flattened tour path
 */
export const createTourPathFromGroups = (
  stepGroups: TourStepGroup[]
): TourPath => {
  // Flatten all steps from all groups
  const allSteps: TourStep[] = stepGroups.reduce(
    (acc: TourStep[], group: TourStepGroup) => {
      // If group has steps, add them to the accumulator
      if (group.steps && group.steps.length) {
        return [...acc, ...group.steps];
      }
      return acc;
    },
    []
  );

  // Create a path from the flattened steps
  return createTourPath(allSteps);
};
