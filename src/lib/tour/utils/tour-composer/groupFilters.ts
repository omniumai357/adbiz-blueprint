
import { StepGroup, getAllStepGroups } from '../../core/tourStepGroups';

/**
 * Get all step group IDs that have a specific tag
 * 
 * @param tag Tag to filter by
 * @returns Array of step group IDs with the tag
 */
export function getStepGroupsByTag(tag: string): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.keys(allGroups).filter(groupId => {
    const group = allGroups[groupId];
    if (!group.metadata || !group.metadata.tags) return false;
    
    return group.metadata.tags.includes(tag);
  });
}

/**
 * Get all step group IDs that match a specific experience level
 * 
 * @param level Experience level to filter by
 * @returns Array of step group IDs for the experience level
 */
export function getStepGroupsByExperienceLevel(
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.keys(allGroups).filter(groupId => {
    const group = allGroups[groupId];
    if (!group.metadata || !group.metadata.experienceLevel) return level === 'all';
    
    if (level === 'all') return true;
    return group.metadata.experienceLevel === level || group.metadata.experienceLevel === 'all';
  });
}
