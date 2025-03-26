
import { TourStep } from "@/contexts/tour/types";

/**
 * Creates a step that depends on other steps
 * 
 * @param dependencies Array of step IDs that must be completed before this step
 * @param type Type of dependency - hard (required) or soft (recommended)
 * @returns A function that enhances the step with dependencies
 */
export function dependentOnSteps(
  dependencies: string[],
  type: 'hard' | 'soft' = 'hard'
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        dependencies,
        dependencyType: type
      }
    };
  };
}

/**
 * Creates a step that depends on completion of specific tour paths
 * 
 * @param pathIds Array of tour path IDs that must be completed
 * @returns A function that enhances the step with path dependencies
 */
export function dependentOnPaths(
  pathIds: string[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    // Create a condition function that checks if all required paths are completed
    const condition = () => {
      try {
        const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
        return pathIds.every(pathId => completedTours.includes(pathId));
      } catch (e) {
        return false;
      }
    };
    
    return {
      ...step,
      condition,
      metadata: {
        ...(step.metadata || {}),
        dependentPaths: pathIds
      }
    };
  };
}

/**
 * Creates a branching step that can lead to different next steps
 * 
 * @param branches Array of branch options with conditions and target steps
 * @returns A function that enhances the step with branching capabilities
 */
export function branchingStep(
  branches: {
    condition: () => boolean;
    targetStepId: string;
    label?: string;
  }[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        branches
      }
    };
  };
}

/**
 * Creates a step that becomes a re-entry point after skipping sections
 * 
 * @param skippedSectionIds Optional array of section IDs that can be skipped
 * @returns A function that enhances the step as a re-entry point
 */
export function reEntryPoint(
  skippedSectionIds?: string[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        isReEntryPoint: true,
        skippedSectionIds
      }
    };
  };
}

/**
 * Creates a step that belongs to a specific section of the tour
 * Sections can be skipped or made optional
 * 
 * @param sectionId Unique identifier for the section
 * @param options Configuration options for the section
 * @returns A function that enhances the step with section information
 */
export function sectionStep(
  sectionId: string,
  options?: {
    isOptional?: boolean;
    title?: string;
    description?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        sectionId,
        sectionOptions: options
      },
      isOptional: options?.isOptional || step.isOptional
    };
  };
}
