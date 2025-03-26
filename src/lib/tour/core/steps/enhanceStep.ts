
import { TourStep } from "@/contexts/tour/types";

/**
 * Utility function to enhance a step with one or more enhancers
 * 
 * @param step Base tour step
 * @param enhancer Function that enhances the step
 * @returns The enhanced tour step
 */
export function enhanceStep(
  step: TourStep,
  enhancer: (step: TourStep) => TourStep
): TourStep {
  return enhancer(step);
}
