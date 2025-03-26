
import { TourStep } from "@/contexts/tour/types";

/**
 * Applies animation effects to a tour step
 */
export const withAnimation = (animation: string | {
  entry?: string;
  highlight?: string;
  exit?: string;
}) => (step: TourStep): TourStep => {
  return {
    ...step,
    animation
  };
};

/**
 * Marks a step as optional
 */
export const withOptional = (isOptional = true) => (step: TourStep): TourStep => {
  return {
    ...step,
    isOptional
  };
};

/**
 * Adds media to a tour step
 */
export const withMedia = (
  url: string,
  type: "image" | "video" | "gif" = "image",
  alt?: string,
  animation?: string
) => (step: TourStep): TourStep => {
  return {
    ...step,
    media: {
      type,
      url,
      alt: alt || step.title,
      animation,
    },
  };
};

/**
 * Adds spotlight customization to a tour step
 */
export const withSpotlight = (options: {
  intensity?: "low" | "medium" | "high";
  color?: string;
  pulseEffect?: boolean;
  fadeBackground?: boolean;
}) => (step: TourStep): TourStep => {
  return {
    ...step,
    spotlight: options
  };
};

/**
 * Adds transition animation to a tour step
 */
export const withTransition = (
  type: "fade" | "slide" | "zoom" | "flip" | "none",
  options?: {
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  }
) => (step: TourStep): TourStep => {
  return {
    ...step,
    transition: {
      type,
      direction: options?.direction,
      duration: options?.duration,
    },
  };
};

/**
 * Adds 3D effects to a tour step
 */
export const with3DEffects = (
  intensity: number = 5,
  enable: boolean = true
) => (step: TourStep): TourStep => {
  return {
    ...step,
    effects3D: {
      enable,
      intensity,
    },
  };
};

/**
 * Sets position for a tour step
 */
export const withPosition = (
  position: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left"
) => (step: TourStep): TourStep => {
  return {
    ...step,
    position
  };
};

/**
 * Combines multiple visual enhancers into one
 */
export const withVisualEnhancements = (options: {
  position?: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  animation?: string | {
    entry?: string;
    highlight?: string;
    exit?: string;
  };
  media?: {
    url: string;
    type?: "image" | "video" | "gif";
    alt?: string;
    animation?: string;
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
  effects3D?: {
    enable?: boolean;
    intensity?: number;
  };
  isOptional?: boolean;
}) => (step: TourStep): TourStep => {
  let enhancedStep = { ...step };

  if (options.position) {
    enhancedStep.position = options.position;
  }

  if (options.animation) {
    enhancedStep.animation = options.animation;
  }

  if (options.media) {
    enhancedStep.media = {
      type: options.media.type || "image",
      url: options.media.url,
      alt: options.media.alt || step.title,
      animation: options.media.animation,
    };
  }

  if (options.spotlight) {
    enhancedStep.spotlight = options.spotlight;
  }

  if (options.transition) {
    enhancedStep.transition = options.transition;
  }

  if (options.effects3D) {
    enhancedStep.effects3D = options.effects3D;
  }

  if (options.isOptional !== undefined) {
    enhancedStep.isOptional = options.isOptional;
  }

  return enhancedStep;
};

// Alias exports for backward compatibility
export const animatedStep = withAnimation;
export const optionalStep = withOptional;
export const mediaEnhancedStep = withMedia;
export const spotlightStep = withSpotlight;
export const transitionStep = withTransition;
export const positionStep = withPosition;
export const visuallyEnhancedStep = withVisualEnhancements;
