
import { TourStep } from "@/contexts/tour/types";

// Define StepGroup interface
export interface StepGroup {
  id: string;
  name: string;
  steps: TourStep[];
  description?: string;
  metadata?: {
    tags?: string[];
    experienceLevel?: "beginner" | "intermediate" | "advanced" | "all";
    [key: string]: any;
  };
}

// Store for all step groups
const stepGroups: Record<string, StepGroup> = {};

/**
 * Create a step group
 * 
 * @param id Unique identifier for the step group
 * @param name Display name for the step group
 * @param steps Array of steps in the group
 * @param description Optional description of the group
 * @param metadata Optional metadata for filtering and categorization
 * @returns A step group object
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description?: string,
  metadata?: StepGroup['metadata']
): StepGroup {
  const group: StepGroup = {
    id,
    name,
    steps,
    description,
    metadata
  };
  
  // Register the group
  stepGroups[id] = group;
  
  return group;
}

/**
 * Get all registered step groups
 * 
 * @returns Record of all step groups
 */
export function getAllStepGroups(): Record<string, StepGroup> {
  return {...stepGroups};
}

/**
 * Get a specific step group by ID
 * 
 * @param id Group ID to retrieve
 * @returns Step group or undefined if not found
 */
export function getStepGroup(id: string): StepGroup | undefined {
  return stepGroups[id];
}

/**
 * Mark a step as conditional based on a function
 * 
 * @param condition Function that returns boolean to determine if step should be shown
 * @returns Function that enhances the step with a condition
 */
export function conditionalStep(
  condition: () => boolean
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      condition
    };
  };
}

/**
 * Mark a step as belonging to a specific step group
 * 
 * @param groupId ID of the group this step belongs to
 * @returns Function that enhances the step with group metadata
 */
export function stepInGroup(
  groupId: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        groupId
      }
    };
  };
}
