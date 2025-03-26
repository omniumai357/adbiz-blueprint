
import { StepDependency } from './types';

/**
 * Factory function to create a dependency between steps
 */
export function createStepDependency(
  sourceStepId: string,
  targetStepId: string,
  type: 'hard' | 'soft' = 'hard',
  condition?: () => boolean
): StepDependency {
  return {
    sourceStepId,
    targetStepId,
    type,
    condition
  };
}
