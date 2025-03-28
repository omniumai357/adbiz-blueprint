
import { TourStep } from "@/contexts/tour/types";
import { TourStepEnhancer, Position } from "@/lib/tour/types";

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
    default: Position;
    mobile?: Position;
    tablet?: Position;
    desktop?: Position;
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
export const landscapePlacement = (placement: Position): TourStepEnhancer => {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        responsive: {
          ...(step.metadata?.responsive || {}),
          landscape: {
            placement
          }
        }
      }
    };
  };
};
