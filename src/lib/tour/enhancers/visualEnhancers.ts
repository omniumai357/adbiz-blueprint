import { TourStep } from '@/contexts/tour/types';
import { TourStepEnhancer } from '@/lib/tour/types';

/**
 * Apply animation effects to a tour step
 * 
 * @param options Animation options
 * @returns Enhanced step with animation effects
 */
export function animatedStep(options: {
  type?: string;
  duration?: number;
  delay?: number;
  highlight?: string;
  entry?: string;
  exit?: string;
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      animation: typeof options === 'string' 
        ? options 
        : {
            entry: options.entry || 'fade-in',
            highlight: options.highlight || 'pulse',
            exit: options.exit || 'fade-out'
          }
    };
  };
}

/**
 * Mark a tour step as optional
 * 
 * @returns Enhanced step marked as optional
 */
export function optionalStep<T extends TourStep>(step: T): T {
  return {
    ...step,
    isOptional: true
  };
}

/**
 * Add media content to a tour step
 * 
 * @param options Media content options
 * @returns Enhanced step with media content
 */
export function mediaEnhancedStep(options: {
  type: "image" | "video" | "gif";
  url: string;
  alt?: string;
  animation?: string;
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      media: options
    };
  };
}

/**
 * Add spotlight effect to a tour step
 * 
 * @param options Spotlight effect options
 * @returns Enhanced step with spotlight effect
 */
export function spotlightStep(options: {
  intensity?: "low" | "medium" | "high";
  color?: string;
  pulseEffect?: boolean;
  fadeBackground?: boolean;
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      spotlight: options
    };
  };
}

/**
 * Customize the position of a tour step
 * 
 * @param options Position options
 * @returns Enhanced step with custom positioning
 */
export function positionStep(options: {
  position: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  offset?: {
    x?: number;
    y?: number;
  }
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      position: options.position,
      // Add offset to floating UI options if provided
      floatingUIOptions: options.offset ? {
        ...step.floatingUIOptions,
        offset: options.offset
      } : step.floatingUIOptions
    };
  };
}

/**
 * Enhance a step with visual styling
 * 
 * @param options Visual styling options
 * @returns Enhanced step with visual styling
 */
export function visuallyEnhancedStep(options: {
  highlightClass?: string;
  effects3D?: {
    enable?: boolean;
    intensity?: number;
  };
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      highlightClass: options.highlightClass,
      effects3D: options.effects3D
    };
  };
}

/**
 * Add transition effects between steps
 * 
 * @param options Transition options
 * @returns Enhanced step with transition effects
 */
export function transitionStep(options: {
  type: "fade" | "slide" | "zoom" | "flip" | "none";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}) {
  return function <T extends TourStep>(step: T): T {
    return {
      ...step,
      transition: options
    };
  };
}

/**
 * Enhancer to add floating UI options to a step
 * This allows advanced positioning customization
 */
export const withFloatingUI = <T extends TourStep>(options: any): TourStepEnhancer => {
  return (step: T): T => {
    return {
      ...step,
      floatingUIOptions: {
        ...options,
        ...(step.floatingUIOptions || {})
      },
    } as T;
  };
};
