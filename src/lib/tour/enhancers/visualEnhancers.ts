
import { TourStep } from "@/contexts/tour/types";

/**
 * Enhances a step with animation effects
 */
export function animatedStep(animation: {
  entry?: string;
  highlight?: string;
  exit?: string;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      animation: animation
    };
  };
}

/**
 * Marks a step as optional, allowing users to skip it
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
 * Enhances a step with media content (image, video, or GIF)
 */
export function mediaEnhancedStep(
  url: string,
  type: "image" | "video" | "gif" = "image",
  alt?: string,
  animation?: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      media: {
        url,
        type,
        alt: alt || `Media for ${step.title}`,
        animation
      }
    };
  };
}

/**
 * Adds spotlight effect to draw attention to specific elements
 */
export function spotlightStep(options: {
  intensity?: "low" | "medium" | "high";
  color?: string;
  pulseEffect?: boolean;
  fadeBackground?: boolean;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultOptions = {
      intensity: "medium" as const,
      color: "#000000",
      pulseEffect: false,
      fadeBackground: true
    };
    
    const spotlightOptions = { ...defaultOptions, ...options };
    
    return {
      ...step,
      spotlight: spotlightOptions
    };
  };
}

/**
 * Adds transition effects between steps
 */
export function transitionStep(
  type: "fade" | "slide" | "zoom" | "flip" | "none" = "fade",
  options?: {
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultOptions = {
      direction: "right" as const,
      duration: 300
    };
    
    const transitionOptions = {
      type,
      ...defaultOptions,
      ...options
    };
    
    return {
      ...step,
      transition: transitionOptions
    };
  };
}

/**
 * Sets explicit positioning for a tour step
 */
export function positionStep(
  position: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left"
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      placement: position as any
    };
  };
}

/**
 * Comprehensive visual enhancement with multiple effects
 */
export function visuallyEnhancedStep(options: {
  animation?: {
    highlight?: string;
    entry?: string;
    exit?: string;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    type?: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    let enhancedStep = { ...step };
    
    if (options.animation) {
      enhancedStep = animatedStep(options.animation)(enhancedStep);
    }
    
    if (options.spotlight) {
      enhancedStep = spotlightStep(options.spotlight)(enhancedStep);
    }
    
    if (options.transition) {
      enhancedStep = transitionStep(
        options.transition.type || "fade",
        {
          direction: options.transition.direction,
          duration: options.transition.duration
        }
      )(enhancedStep);
    }
    
    return enhancedStep;
  };
}
