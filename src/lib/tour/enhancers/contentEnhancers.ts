
import { TourStep } from "@/contexts/tour-context";
import { DynamicContentProvider } from "@/hooks/tour/analytics/types";

/**
 * Adds metadata to a tour step
 * 
 * @param metadata Object containing arbitrary metadata
 * @returns A function that enhances the step with metadata
 */
export function metadataEnhancedStep(
  metadata: Record<string, any>
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata
    };
  };
}

/**
 * Creates a step with dynamic content that can be loaded asynchronously
 * 
 * @param contentProvider Function that returns content string or Promise<string>
 * @returns A function that enhances the step with dynamic content loading capability
 */
export function dynamicContentStep(
  contentProvider: DynamicContentProvider
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const originalContent = step.content;
    
    return {
      ...step,
      // Store the original content as fallback
      metadata: {
        ...step.metadata,
        originalContent,
        dynamicContentProvider: contentProvider
      },
      // We'll replace this in the tour controller when the step is loaded
      content: originalContent
    };
  };
}
