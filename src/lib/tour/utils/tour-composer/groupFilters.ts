
import { getAllStepGroups } from '@/lib/tour/core/tourStepGroups';

/**
 * Filters step groups by their category or tag
 * 
 * @param tag The tag or category to filter by
 * @returns Array of group IDs matching the tag
 */
export function getStepGroupsByTag(tag: string): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.values(allGroups)
    .filter(group => {
      // Match tag either in the group ID or in its metadata
      return group.id.includes(tag) || 
             (group.metadata && group.metadata.tags && 
              (group.metadata.tags as string[]).includes(tag));
    })
    .map(group => group.id);
}

/**
 * Groups step groups by experience level
 * 
 * @param level The experience level to filter by
 * @returns Array of group IDs matching the experience level
 */
export function getStepGroupsByExperienceLevel(level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.values(allGroups)
    .filter(group => {
      return group.metadata?.experienceLevel === level;
    })
    .map(group => group.id);
}
