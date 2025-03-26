
import { TourStep } from "@/contexts/tour-context";
import { PathOptions, defaultPathOptions } from "@/lib/utils/path-utils";

/**
 * Adds path animation between the current step and the next step
 * 
 * @param pathOptions Configuration for the animated path
 * @returns Function that enhances the step with path animation
 */
export function pathAnimatedStep(
  pathOptions: Partial<PathOptions> = {}
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      path: {
        enabled: true,
        ...defaultPathOptions,
        ...pathOptions
      }
    };
  };
}

/**
 * Creates a connection path between this step and a specific element
 * 
 * @param targetElementId ID of the element to connect to
 * @param pathOptions Path appearance and animation options
 * @returns Function that enhances the step with a connection path
 */
export function connectedStep(
  targetElementId: string,
  pathOptions: Partial<PathOptions> = {}
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      path: {
        enabled: true,
        targetElementId,
        ...defaultPathOptions,
        ...pathOptions
      }
    };
  };
}
