
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
  } = { entry: "fade-in", highlight: "pulse" }
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
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      media
    };
  };
}
