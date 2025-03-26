
import { TourStep } from '@/contexts/tour/types';
import { registerStepGroup, getAllStepGroups as getRegisteredGroups } from './registry';

// Interface for a step group
interface StepGroup {
  id: string;
  name: string;
  steps: TourStep[];
  description?: string;
}

// Private registry of step groups
const stepGroups: Record<string, StepGroup> = {};

/**
 * Create a new step group
 * 
 * @param id Unique identifier for the group
 * @param name Display name for the group
 * @param steps Array of tour steps in this group
 * @param description Optional description of the group
 * @returns A step group object
 */
export function createStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description?: string
): StepGroup {
  const group = { id, name, steps, description };
  
  // Register the group in the registry
  registerStepGroup(id, name, steps, description);
  
  // Also store in the local registry
  stepGroups[id] = group;
  
  return group;
}

/**
 * Get a step group by ID
 * 
 * @param id ID of the step group to retrieve
 * @returns The step group or undefined if not found
 */
export function getStepGroup(id: string): StepGroup | undefined {
  return stepGroups[id];
}

/**
 * Get all registered step groups
 * 
 * @returns Record of all step groups keyed by ID
 */
export function getAllStepGroups(): Record<string, StepGroup> {
  // Combine local registry with global registry
  return { ...stepGroups, ...getRegisteredGroups() };
}

/**
 * Add a step to a group
 * 
 * @param groupId ID of the group to add the step to
 * @param step The tour step to add
 */
export function addStepToGroup(groupId: string, step: TourStep): void {
  if (!stepGroups[groupId]) {
    stepGroups[groupId] = {
      id: groupId,
      name: groupId, // Default name to ID
      steps: []
    };
  }
  
  stepGroups[groupId].steps.push(step);
}

/**
 * Remove a step from a group
 * 
 * @param groupId ID of the group
 * @param stepId ID of the step to remove
 * @returns True if the step was found and removed, false otherwise
 */
export function removeStepFromGroup(groupId: string, stepId: string): boolean {
  if (!stepGroups[groupId]) return false;
  
  const initialLength = stepGroups[groupId].steps.length;
  stepGroups[groupId].steps = stepGroups[groupId].steps.filter(step => step.id !== stepId);
  
  return stepGroups[groupId].steps.length !== initialLength;
}

/**
 * Clear all step groups (useful for testing)
 */
export function clearStepGroups(): void {
  Object.keys(stepGroups).forEach(key => delete stepGroups[key]);
}

/**
 * Sort steps within a group by priority
 * 
 * @param groupId ID of the group to sort
 */
export function sortGroupStepsByPriority(groupId: string): void {
  if (!stepGroups[groupId]) return;
  
  stepGroups[groupId].steps.sort((a, b) => {
    const priorityA = a.metadata?.priority || 0;
    const priorityB = b.metadata?.priority || 0;
    return priorityA - priorityB;
  });
}
