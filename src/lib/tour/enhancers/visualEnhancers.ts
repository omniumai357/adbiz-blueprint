
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
      media
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
    focus?: "element" | "content" | "both";
    blurBackground?: boolean;
    zoomEffect?: boolean;
  } = { 
    intensity: "medium", 
    pulseEffect: true,
    fadeBackground: true,
    focus: "element"
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
    type: "fade" | "slide" | "zoom" | "flip" | "none" | "rotate" | "blur" | "reveal";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
    easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
    delay?: number;
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
  position: "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      position
    };
  };
}

/**
 * Adds 3D effects to tour elements
 * 
 * @param effects 3D effect configuration
 * @returns Function that enhances the step with 3D effects
 */
export function effect3DStep(
  effects: {
    perspective?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    scale?: number;
    duration?: number;
  } = {
    perspective: 1000,
    rotateY: 15,
    scale: 1.05,
    duration: 300
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      effects3D: effects
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
      fadeBackground?: boolean;
      focus?: "element" | "content" | "both";
      blurBackground?: boolean;
    };
    transition?: {
      type?: "fade" | "slide" | "zoom" | "flip" | "rotate" | "blur" | "reveal";
      direction?: "up" | "down" | "left" | "right";
      duration?: number;
      easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
    };
    position?: "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    media?: {
      type: "image" | "video" | "gif";
      url: string;
      alt?: string;
      animation?: string;
    };
    effects3D?: {
      perspective?: number;
      rotateX?: number;
      rotateY?: number;
      rotateZ?: number;
      scale?: number;
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
    
    if (options.effects3D) {
      enhancedStep = effect3DStep(options.effects3D)(enhancedStep);
    }
    
    return enhancedStep;
  };
}
