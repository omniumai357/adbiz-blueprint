
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

/**
 * Creates a path with obstacle avoidance
 * 
 * @param targetElementId ID of the element to connect to
 * @returns Function that enhances the step with obstacle-avoiding path
 */
export function obstacleAvoidingPath(
  targetElementId: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      path: {
        enabled: true,
        targetElementId,
        style: "angled",
        avoidObstacles: true,
        ...defaultPathOptions
      }
    };
  };
}

/**
 * Creates a complex multi-segment path through multiple points
 * 
 * @param targetElementId Final destination element ID
 * @param waypoints Array of intermediate element IDs to pass through
 * @returns Function that enhances the step with a multi-segment path
 */
export function complexPath(
  targetElementId: string,
  waypoints: string[] = []
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      path: {
        enabled: true,
        targetElementId,
        waypoints,
        style: "curved",
        ...defaultPathOptions
      }
    };
  };
}

/**
 * Applies animated effects to the path
 * 
 * @param targetElementId ID of the element to connect to
 * @param animationOptions Animation configuration
 * @returns Function that enhances the step with animated path effects
 */
export function animatedPath(
  targetElementId: string,
  animationOptions: {
    duration?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    delay?: number;
    repeat?: number | 'infinite';
    type?: 'dash' | 'glow' | 'pulse' | 'draw';
  } = {
    duration: 1000,
    easing: 'ease-out',
    type: 'draw'
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const duration = animationOptions.duration || 1000;
    const dashArray = animationOptions.type === 'dash' ? "8,8" : "0";
    
    return {
      ...step,
      path: {
        enabled: true,
        targetElementId,
        animationDuration: duration,
        animationEasing: animationOptions.easing || 'ease-out',
        dashArray,
        ...defaultPathOptions
      }
    };
  };
}
