
/**
 * Represents a dependency relationship between steps
 */
export interface StepDependency {
  sourceStepId: string;
  targetStepId: string;
  type: 'hard' | 'soft'; // hard = must complete, soft = should complete
  condition?: () => boolean;
}

/**
 * Represents a node in the dependency graph
 */
export interface DependencyNode {
  stepId: string;
  dependencies: string[]; // IDs of steps this step depends on
  dependents: string[]; // IDs of steps that depend on this step
}

/**
 * Represents a branch condition for step navigation
 */
export interface BranchCondition {
  condition: () => boolean;
  targetStepId: string;
  label?: string;
}
