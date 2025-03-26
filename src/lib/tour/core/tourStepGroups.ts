
import { TourStep } from '@/contexts/tour/types';

/**
 * StepGroup interface for grouping related tour steps
 */
export interface StepGroup {
  id: string;
  name: string;
  steps: TourStep[];
  description?: string;
  metadata?: {
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    userRoles?: string[];
    [key: string]: any;
  };
}

// Registry for step groups
const stepGroupRegistry: Record<string, StepGroup> = {};

/**
 * Create a step group with related tour steps
 * 
 * @param id Unique identifier for the step group
 * @param name Display name for the step group
 * @param steps Array of tour steps in the group
 * @param description Optional description of the step group
 * @param metadata Optional metadata for the step group
 * @returns A step group object
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description?: string,
  metadata?: {
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    userRoles?: string[];
    [key: string]: any;
  }
): StepGroup {
  const stepGroup: StepGroup = {
    id,
    name,
    steps,
    description,
    metadata
  };
  
  // Register the step group
  stepGroupRegistry[id] = stepGroup;
  
  return stepGroup;
}

/**
 * Make a step conditional based on a function
 * 
 * @param step Tour step to make conditional
 * @param conditionFn Function that determines if the step should be shown
 * @returns The same step with a condition function
 */
export function conditionalStep(
  step: TourStep,
  conditionFn: () => boolean
): TourStep {
  return {
    ...step,
    condition: conditionFn
  };
}

/**
 * Associate a step with a specific group for organization
 * 
 * @param step Tour step to associate with a group
 * @param groupId ID of the step group
 * @returns The same step with group metadata
 */
export function stepInGroup(
  step: TourStep,
  groupId: string
): TourStep {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      groupId
    }
  };
}

/**
 * Get all registered step groups
 * @returns Record of all step groups
 */
export function getAllStepGroups(): Record<string, StepGroup> {
  return { ...stepGroupRegistry };
}

/**
 * Get a specific step group by ID
 * @param id Step group ID
 * @returns Step group object or undefined if not found
 */
export function getStepGroup(id: string): StepGroup | undefined {
  return stepGroupRegistry[id];
}
