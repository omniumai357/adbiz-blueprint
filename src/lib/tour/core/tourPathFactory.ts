
import { TourPath, TourStep } from "@/contexts/tour-context";

/**
 * Helper function to create tour paths with conditional steps
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param steps Array of tour steps
 * @param options Additional tour path configuration options
 * @returns A configured TourPath object
 */
export function createTourPath(
  id: string,
  name: string,
  steps: TourStep[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    requiredUserRoles?: string[];
    completionCallback?: () => void;
    metadata?: Record<string, any>;
  }
): TourPath {
  return {
    id,
    name,
    steps,
    ...options
  };
}

/**
 * Creates a basic tour step with required fields
 * 
 * @param id Unique step identifier
 * @param elementId Target DOM element ID
 * @param title Step title
 * @param content Step content
 * @param position Position relative to target element
 * @returns A basic TourStep
 */
export function createStep(
  id: string,
  elementId: string,
  title: string,
  content: string,
  position: "top" | "right" | "bottom" | "left" = "bottom"
): TourStep {
  return {
    id,
    elementId,
    title,
    content,
    position
  };
}

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
