
import { TourStep } from "@/contexts/tour/types";
import { TourStepEnhancer } from "@/lib/tour/types";

export interface ResponsiveContent {
  default: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}

/**
 * Adds responsive content to a tour step based on device type
 * 
 * @param content Object with content variations for different devices
 * @returns A function that enhances the step with responsive content
 */
export function responsiveContentEnhancedStep(
  content: ResponsiveContent
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        responsiveContent: content
      },
      // Keep original content as default
      content: content.default
    };
  };
}

/**
 * Configures a step's position differently based on viewport size
 * 
 * @param positions Position configurations for different viewports
 * @returns A function that enhances the step with responsive positioning
 */
export function responsivePositionEnhancedStep(
  positions: {
    default: "top" | "right" | "bottom" | "left";
    mobile?: "top" | "right" | "bottom" | "left";
    tablet?: "top" | "right" | "bottom" | "left";
    desktop?: "top" | "right" | "bottom" | "left";
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        responsivePosition: positions
      },
      // Keep original position as default
      position: positions.default
    };
  };
}

/**
 * Adapts the element selector based on viewport size
 * 
 * @param selectors Selectors for different device types
 * @returns A function that enhances the step with responsive selectors
 */
export function responsiveSelectorEnhancedStep(
  selectors: {
    default: string;
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        responsiveSelector: selectors
      },
      // Keep original selector as default
      selector: selectors.default
    };
  };
}

/**
 * Creates a step that adjusts its placement in landscape mode
 */
export const landscapePlacement = (placement: "top" | "right" | "bottom" | "left"): TourStepEnhancer => {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        responsive: {
          ...(step.metadata?.responsive || {}),
          landscape: {
            placement // Ensure we use the strongly typed placement here
          }
        }
      }
    };
  };
};
