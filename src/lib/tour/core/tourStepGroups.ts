
import { TourStep } from '@/contexts/tour/types';

export interface StepGroup {
  id: string;
  name: string;
  steps: TourStep[];
  description?: string;
  metadata?: {
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    [key: string]: any;
  };
}

// Registry for step groups
const stepGroupRegistry: Record<string, StepGroup> = {};

/**
 * Create a new step group
 * 
 * @param id Unique identifier for the step group
 * @param name Display name for the step group
 * @param steps Array of tour steps to include in the group
 * @param description Optional description of the step group
 * @param metadata Optional metadata for the step group
 * @returns A new step group object
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description?: string,
  metadata?: {
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    [key: string]: any;
  }
): StepGroup {
  // Register the new step group
  const stepGroup = {
    id,
    name,
    steps,
    description,
    metadata
  };
  
  stepGroupRegistry[id] = stepGroup;
  
  return stepGroup;
}

/**
 * Get all registered step groups
 * 
 * @returns Object containing all registered step groups
 */
export function getAllStepGroups(): Record<string, StepGroup> {
  return { ...stepGroupRegistry };
}

/**
 * Get a specific step group by ID
 * 
 * @param id ID of the step group to retrieve
 * @returns The requested step group or undefined if not found
 */
export function getStepGroup(id: string): StepGroup | undefined {
  return stepGroupRegistry[id];
}

/**
 * Mark a step as conditional based on a condition function
 * 
 * @param step The tour step to make conditional
 * @param condition Function that returns true if the step should be shown
 * @returns The tour step with conditional behavior
 */
export function conditionalStep(step: TourStep, condition: () => boolean): TourStep {
  return {
    ...step,
    condition
  };
}

/**
 * Mark a step as belonging to a specific group
 * 
 * @param stepId ID of the step
 * @param groupId ID of the group
 * @returns An object representing the step-group relationship
 */
export function stepInGroup(stepId: string, groupId: string) {
  return {
    stepId,
    groupId
  };
}
