
import { TourStep } from "@/contexts/tour/types";
import { BranchCondition } from './types';

/**
 * Enhancer that adds dependencies to a step
 */
export function dependentStep(
  dependencies: string | string[],
  type: 'hard' | 'soft' = 'hard'
) {
  return (step: TourStep): TourStep => {
    const deps = Array.isArray(dependencies) ? dependencies : [dependencies];
    
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        dependencies: deps,
        dependencyType: type
      }
    };
  };
}

/**
 * Enhancer that adds branching logic to a step
 */
export function branchingStep(
  branches: BranchCondition[]
) {
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
          ...(step.actions?.next || {}),
          onClick: () => {
            // This will be processed by the tour controller to determine the next step
            return { type: 'BRANCH', branches };
          }
        }
      }
    };
  };
}

/**
 * Enhancer for creating a re-entry point in a tour
 * This is useful for allowing users to return to a specific step
 */
export function reEntryPoint() {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        isReEntryPoint: true
      }
    };
  };
}

/**
 * Enhancer for marking a step as part of a logical section
 * Useful for grouping related steps in complex tours
 */
export function sectionStep(sectionId: string) {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        sectionId
      }
    };
  };
}
