import { TourStep } from '@/contexts/tour/types';

/**
 * Creates a step that depends on another step being completed
 * 
 * @param dependencyStepId ID of the step that must be completed first
 * @returns A function that enhances the step with a dependency
 */
export function dependentStep(
  dependencyStepId: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      dependencies: [...(step.dependencies || []), dependencyStepId]
    };
  };
}

/**
 * Creates a re-entry point in a tour path
 * 
 * @param targetStepId ID of the step to return to
 * @returns A function that enhances the step as a re-entry point
 */
export function reEntryPoint(
  targetStepId: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        reEntry: targetStepId
      }
    };
  };
}

/**
 * Marks a step as the start of a new section
 * 
 * @param sectionName Name of the section
 * @returns A function that enhances the step as a section start
 */
export function sectionStep(
  sectionName: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        sectionStart: sectionName
      }
    };
  };
}

export function branchingStep(
  condition: () => boolean,
  truePathId: string,
  falsePathId: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      actions: {
        next: {
          label: "Continue",
          callback: () => {
            // The next path depends on the condition
            const nextPathId = condition() ? truePathId : falsePathId;
            // We'll handle the path change in the tour controller
            console.log(`Branching to path: ${nextPathId}`);
          }
        }
      }
    };
  };
}

/**
 * Create enhancer to set button labels
 */
export const withButtonLabels = (options: {
  next?: string;
  prev?: string;
  skip?: string;
  close?: string;
}) => {
  return (step: TourStep): Partial<TourStep> => {
    const { next, prev, skip, close } = options;
    
    // Create the actions object if it doesn't exist
    const actions = step.actions || {};
    
    // Initialize objects if they don't exist
    if (!actions.next) actions.next = {};
    if (!actions.prev) actions.prev = {};
    if (!actions.skip) actions.skip = {};
    if (!actions.close) actions.close = {};
    
    // Use text property instead of label
    if (next) actions.next.text = next;
    if (prev) actions.prev.text = prev;
    if (skip) actions.skip.text = skip;
    if (close) actions.close.text = close;
    
    return { actions };
  };
};
