
import { TourStep } from "@/contexts/tour/types";

/**
 * Enhances a step with animation effects
 * 
 * @param animation Animation configuration
 * @returns A function that enhances the step with animation
 */
export function animatedStep(
  animation: string | {
    entry?: string;
    highlight?: string;
    exit?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      animation
    };
  };
}

/**
 * Marks a step as optional in the tour
 * 
 * @returns A function that enhances the step as optional
 */
export function optionalStep(): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      isOptional: true
    };
  };
}

/**
 * Enhances a step with media content
 * 
 * @param mediaConfig Media configuration
 * @returns A function that enhances the step with media
 */
export function mediaEnhancedStep(
  mediaConfig: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      media: mediaConfig
    };
  };
}

/**
 * Adds spotlight effect to a tour step
 * 
 * @param spotlightConfig Spotlight configuration
 * @returns A function that enhances the step with spotlight effects
 */
export function spotlightStep(
  spotlightConfig: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      spotlight: spotlightConfig
    };
  };
}

/**
 * Sets the position of a tour step
 * 
 * @param position Position relative to the target element
 * @returns A function that enhances the step with position
 */
export function positionStep(
  position: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left"
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      position
    };
  };
}

/**
 * Enhances a step with visual styling
 * 
 * @param options Visual enhancement options
 * @returns A function that enhances the step visually
 */
export function visuallyEnhancedStep(
  options: {
    highlightClass?: string;
    spotlightPadding?: number;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      highlightClass: options.highlightClass,
      spotlightPadding: options.spotlightPadding
    };
  };
}

/**
 * Adds transition effects to a tour step
 * 
 * @param transitionConfig Transition configuration
 * @returns A function that enhances the step with transitions
 */
export function transitionStep(
  transitionConfig: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      transition: transitionConfig
    };
  };
}
