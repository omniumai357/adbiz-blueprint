
import { TourStep } from "@/contexts/tour-context";

/**
 * Adds path animation to a tour step
 * 
 * @param animation Animation configuration for the path
 * @returns A function that enhances the step with path animation
 */
export function pathAnimatedStep(
  animation: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        pathAnimation: animation
      }
    };
  };
}

/**
 * Creates a step connected to another element with a path
 * 
 * @param targetElementId ID of the element to connect to
 * @param pathStyle Path style (e.g., "dashed", "solid", "dotted")
 * @returns A function that enhances the step with connection path
 */
export function connectedStep(
  targetElementId: string,
  pathStyle?: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        pathConnection: {
          targetElementId,
          style: pathStyle || "solid"
        }
      }
    };
  };
}
