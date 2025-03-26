
import { TourStep } from "@/contexts/tour-context";

/**
 * Adds animation effects to a tour step
 * 
 * @param animation Animation configuration
 * @returns A function that enhances the step with animations
 */
export function animatedStep(
  animation: {
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
 * Marks a tour step as optional
 * 
 * @returns A function that enhances the step as optional
 */
export function optionalStep(): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      optional: true
    };
  };
}

/**
 * Adds media (image, video, gif) to a tour step
 * 
 * @param media Media configuration
 * @returns A function that enhances the step with media
 */
export function mediaEnhancedStep(
  media: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      media
    };
  };
}

/**
 * Adds spotlight effect to a tour step
 * 
 * @param spotlight Spotlight configuration
 * @returns A function that enhances the step with spotlight
 */
export function spotlightStep(
  spotlight: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      spotlight
    };
  };
}

/**
 * Sets the position of a tour step
 * 
 * @param position Position of the step tooltip
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
 * Adds transition effects to a tour step
 * 
 * @param transition Transition configuration
 * @returns A function that enhances the step with transition
 */
export function transitionStep(
  transition: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "right" | "left" | "up" | "down";
    duration?: number;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      transition
    };
  };
}

/**
 * Combines multiple visual enhancements for a tour step
 * 
 * @param options Combined visual enhancements
 * @returns A function that enhances the step with visual effects
 */
export function visuallyEnhancedStep(
  options: {
    position?: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
    animation?: {
      entry?: string;
      highlight?: string;
      exit?: string;
    };
    spotlight?: {
      intensity?: "low" | "medium" | "high";
      color?: string;
      pulseEffect?: boolean;
      fadeBackground?: boolean;
    };
    transition?: {
      type: "fade" | "slide" | "zoom" | "flip" | "none";
      direction?: "right" | "left" | "up" | "down";
      duration?: number;
    };
    media?: {
      type: "image" | "video" | "gif";
      url: string;
      alt?: string;
      animation?: string;
    };
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      ...options
    };
  };
}
