
import { TourStep } from "@/contexts/tour-context";
import { enhanceStep } from "./tourPathFactory";

/**
 * Type definition for a named group of tour steps
 */
export interface TourStepGroup {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
}

// Registry to store all available step groups
const stepGroupRegistry: Record<string, TourStepGroup> = {};

/**
 * Creates and registers a reusable group of tour steps
 * 
 * @param id Unique identifier for the step group
 * @param name Human-readable name for the step group
 * @param steps Array of tour steps in this group
 * @param description Optional description of the step group's purpose
 * @returns The created TourStepGroup
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description: string = ""
): TourStepGroup {
  if (stepGroupRegistry[id]) {
    console.warn(`Step group with ID "${id}" already exists. Overwriting.`);
  }
  
  const stepGroup: TourStepGroup = {
    id,
    name,
    description,
    steps
  };
  
  // Register the step group for later use
  stepGroupRegistry[id] = stepGroup;
  
  return stepGroup;
}

/**
 * Retrieves a registered step group by ID
 * 
 * @param groupId ID of the step group to retrieve
 * @returns The requested step group or undefined if not found
 */
export function getStepGroup(groupId: string): TourStepGroup | undefined {
  return stepGroupRegistry[groupId];
}

/**
 * Returns all registered step groups
 * 
 * @returns Record of all registered step groups
 */
export function getAllStepGroups(): Record<string, TourStepGroup> {
  return { ...stepGroupRegistry };
}

/**
 * Composes a group of steps by combining multiple step groups
 * 
 * @param groupIds Array of step group IDs to include
 * @param options Configuration options for the composition
 * @returns Array of tour steps from all included groups
 */
export function composeStepGroups(
  groupIds: string[],
  options: {
    filterSteps?: (step: TourStep) => boolean;
    transformStep?: (step: TourStep) => TourStep;
  } = {}
): TourStep[] {
  const { filterSteps, transformStep } = options;
  
  // Collect steps from all specified groups
  let composedSteps = groupIds.flatMap(groupId => {
    const group = getStepGroup(groupId);
    return group ? group.steps : [];
  });
  
  // Apply filtering if specified
  if (filterSteps) {
    composedSteps = composedSteps.filter(filterSteps);
  }
  
  // Apply transformation if specified
  if (transformStep) {
    composedSteps = composedSteps.map(transformStep);
  }
  
  return composedSteps;
}

/**
 * Enhancer function that adds a group identifier to a step
 * 
 * @param groupId The ID of the group this step belongs to
 * @returns A function that enhances a step with group metadata
 */
export function stepInGroup(groupId: string) {
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
