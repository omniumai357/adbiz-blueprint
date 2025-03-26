
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
  metadata?: {
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    featureArea?: string;
    requiredRoles?: string[];
    priority?: number;
    [key: string]: any;
  };
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
 * @param metadata Optional metadata for additional categorization
 * @returns The created TourStepGroup
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description: string = "",
  metadata?: TourStepGroup['metadata']
): TourStepGroup {
  if (stepGroupRegistry[id]) {
    console.warn(`Step group with ID "${id}" already exists. Overwriting.`);
  }
  
  const stepGroup: TourStepGroup = {
    id,
    name,
    description,
    steps,
    metadata
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
 * Filters step groups by metadata criteria
 * 
 * @param criteria Object with metadata fields to filter by
 * @returns Array of step groups matching the criteria
 */
export function filterStepGroups(criteria: Partial<TourStepGroup['metadata']>): TourStepGroup[] {
  return Object.values(stepGroupRegistry).filter(group => {
    if (!group.metadata) return false;
    
    // Check each criteria field
    return Object.entries(criteria).every(([key, value]) => {
      // For arrays (like tags), check if any value matches
      if (Array.isArray(group.metadata[key]) && Array.isArray(value)) {
        return value.some(v => (group.metadata?.[key] as any[]).includes(v));
      }
      
      // For simple values, check exact match
      return group.metadata[key] === value;
    });
  });
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
    sortBy?: 'priority' | 'experienceLevel';
  } = {}
): TourStep[] {
  const { filterSteps, transformStep, sortBy } = options;
  
  // Collect steps from all specified groups
  let composedSteps = groupIds.flatMap(groupId => {
    const group = getStepGroup(groupId);
    return group ? group.steps : [];
  });
  
  // Apply filtering if specified
  if (filterSteps) {
    composedSteps = composedSteps.filter(filterSteps);
  }
  
  // Apply sorting if specified
  if (sortBy) {
    composedSteps = composedSteps.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        return priorityB - priorityA; // Higher priority first
      } else if (sortBy === 'experienceLevel') {
        const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
        const levelA = levelMap[(a.metadata?.experienceLevel as string) || 'beginner'] || 1;
        const levelB = levelMap[(b.metadata?.experienceLevel as string) || 'beginner'] || 1;
        return levelA - levelB; // Beginner first
      }
      return 0;
    });
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

/**
 * Enhancer function that adds tags to a step for categorization
 * 
 * @param tags Array of tags to categorize the step
 * @returns A function that enhances a step with tags
 */
export function taggedStep(tags: string[]) {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        tags: [...(step.metadata?.tags || []), ...tags]
      }
    };
  };
}

/**
 * Enhancer function that adds experience level to a step
 * 
 * @param level The experience level for this step
 * @returns A function that enhances a step with experience level
 */
export function experienceLevelStep(level: 'beginner' | 'intermediate' | 'advanced') {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        experienceLevel: level
      }
    };
  };
}

/**
 * Enhancer function that adds feature area to a step
 * 
 * @param featureArea The feature area this step belongs to
 * @returns A function that enhances a step with feature area
 */
export function featureAreaStep(featureArea: string) {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        featureArea
      }
    };
  };
}
