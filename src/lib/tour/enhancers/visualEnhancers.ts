
import { TourStep } from "@/contexts/tour-context";

/**
 * Enhances a step with animation properties
 * 
 * @param animations Animation configuration
 * @returns A function that enhances the step with animations
 */
export function animatedStep(
  animations: {
    entry?: string;
    highlight?: string;
    exit?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      animation: {
        ...(step.animation || {}),
        ...animations
      }
    };
  };
}

/**
 * Marks a step as optional, meaning users can skip it
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
 * Enhances a step with media content
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
 * Enhances a step with spotlight effects
 * 
 * @param spotlight Spotlight configuration
 * @returns A function that enhances the step with spotlight effects
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
      spotlight: {
        ...(step.spotlight || {}),
        ...spotlight
      }
    };
  };
}

/**
 * Positions a step relative to its target element
 * 
 * @param position Position configuration
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
 * Combines multiple visual enhancements for a step
 * 
 * @param options Visual configuration options
 * @returns A function that enhances the step with visual options
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
      direction?: "up" | "down" | "left" | "right";
      duration?: number;
    };
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const enhancedStep = { ...step };
    
    if (options.position) {
      enhancedStep.position = options.position;
    }
    
    if (options.animation) {
      enhancedStep.animation = {
        ...(enhancedStep.animation || {}),
        ...options.animation
      };
    }
    
    if (options.spotlight) {
      enhancedStep.spotlight = {
        ...(enhancedStep.spotlight || {}),
        ...options.spotlight
      };
    }
    
    if (options.transition) {
      enhancedStep.transition = {
        ...(enhancedStep.transition || {}),
        ...options.transition
      };
    }
    
    return enhancedStep;
  };
}

/**
 * Adds 3D effects to a tour step (placeholder for future implementation)
 * 
 * @param effectOptions 3D effect options
 * @returns A function that enhances the step with 3D effects
 */
export function effects3DStep(
  effectOptions: {
    type: "rotate" | "flip" | "tilt";
    intensity?: "low" | "medium" | "high";
    duration?: number;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        effects3D: effectOptions
      }
    };
  };
}
