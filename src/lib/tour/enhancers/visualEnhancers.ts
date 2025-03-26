
import { TourStep } from "@/contexts/tour-context";

/**
 * Adds animation effects to a tour step
 * 
 * @param animation Animation configuration objects
 * @returns A function that enhances the step with animations
 */
export function animatedStep(
  animation: {
    entry?: string;
    exit?: string;
    highlight?: string;
    transition?: string;
    duration?: number;
  } = { 
    entry: "fade-in", 
    highlight: "pulse", 
    transition: "slide",
    duration: 300
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
 * Creates an optional step that can be skipped
 * 
 * @returns A function that enhances the step, marking it as optional
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
 * Adds media content to a tour step
 * 
 * @param media Media configuration object
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
      media: {
        ...media,
        animation: media.animation || "fade-in"
      }
    };
  };
}

/**
 * Adds spotlight effect to draw attention to specific elements
 * 
 * @param spotlightOptions Spotlight configuration
 * @returns A function that enhances the step with spotlight effect
 */
export function spotlightStep(
  spotlightOptions: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  } = { 
    intensity: "medium", 
    pulseEffect: true,
    fadeBackground: true
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      spotlight: spotlightOptions
    };
  };
}

/**
 * Configures transition effects between steps
 * 
 * @param transitionOptions Transition configuration
 * @returns A function that enhances the step with transition effects
 */
export function transitionStep(
  transitionOptions: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
    easing?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      transition: transitionOptions
    };
  };
}

/**
 * Sets the position of the tooltip relative to the target element
 * 
 * @param position Position of the tooltip
 * @returns A function that enhances the step with position information
 */
export function positionStep(
  position: "top" | "right" | "bottom" | "left"
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      position
    };
  };
}

/**
 * Combines multiple visual enhancements into a single enhancer
 * 
 * @param options Combined visual enhancement options
 * @returns A function that applies all specified visual enhancements to a step
 */
export function visuallyEnhancedStep(
  options: {
    animation?: {
      entry?: string;
      exit?: string;
      highlight?: string;
    };
    spotlight?: {
      intensity?: "low" | "medium" | "high";
      color?: string;
      pulseEffect?: boolean;
    };
    transition?: {
      type?: "fade" | "slide" | "zoom" | "flip";
      direction?: "up" | "down" | "left" | "right";
      duration?: number;
    };
    position?: "top" | "right" | "bottom" | "left";
    media?: {
      type: "image" | "video" | "gif";
      url: string;
      alt?: string;
    };
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    let enhancedStep = { ...step };
    
    if (options.animation) {
      enhancedStep = animatedStep(options.animation)(enhancedStep);
    }
    
    if (options.spotlight) {
      enhancedStep = spotlightStep(options.spotlight)(enhancedStep);
    }
    
    if (options.transition) {
      enhancedStep = transitionStep(options.transition as any)(enhancedStep);
    }
    
    if (options.position) {
      enhancedStep = positionStep(options.position)(enhancedStep);
    }
    
    if (options.media) {
      enhancedStep = mediaEnhancedStep(options.media)(enhancedStep);
    }
    
    return enhancedStep;
  };
}
