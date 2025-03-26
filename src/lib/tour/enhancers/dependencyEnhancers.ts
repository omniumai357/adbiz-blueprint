
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
      },
      actions: {
        ...(step.actions || {}),
        next: {
          ...((step.actions?.next as any) || {}),
          callback: () => {
            // Find the first branch whose condition evaluates to true
            const activeBranch = branches.find(branch => branch.condition());
            
            if (activeBranch) {
              // In a real implementation, this would need to communicate with the tour controller
              console.log(`Branching to step: ${activeBranch.targetStepId}`);
              
              // The actual branching logic would go here
              // For now we're just logging the intent
            }
          }
        }
      }
    };
  };
}

/**
 * Creates a step that serves as a re-entry point after a detour
 * 
 * @param sourceStepIds Array of step IDs that can return to this step
 * @returns A function that enhances the step as a re-entry point
 */
export function reEntryPoint(
  sourceStepIds: string[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        isReEntryPoint: true,
        sourceStepIds
      }
    };
  };
}

/**
 * Creates a section step that can be collapsed or expanded
 * 
 * @param sectionName Name of the section for identification
 * @param expanded Whether the section is expanded by default
 * @returns A function that enhances the step as a section
 */
export function sectionStep(
  sectionName: string,
  expanded: boolean = true
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        isSection: true,
        sectionName,
        expanded
      },
      optional: expanded ? step.optional : true
    };
  };
}
