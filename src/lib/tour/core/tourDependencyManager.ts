
import { TourStep, TourPath } from "@/contexts/tour/types";

/**
 * Represents a dependency relationship between steps
 */
interface StepDependency {
  sourceStepId: string;
  targetStepId: string;
  type: 'hard' | 'soft'; // hard = must complete, soft = should complete
  condition?: () => boolean;
}

/**
 * Represents a node in the dependency graph
 */
interface DependencyNode {
  stepId: string;
  dependencies: string[]; // IDs of steps this step depends on
  dependents: string[]; // IDs of steps that depend on this step
}

/**
 * Manages complex dependencies between tour steps
 */
export class TourDependencyManager {
  private dependencyGraph: Map<string, DependencyNode> = new Map();
  private dependencies: StepDependency[] = [];
  
  /**
   * Adds a dependency between steps
   * 
   * @param sourceStepId ID of the step that depends on another
   * @param targetStepId ID of the step that is depended upon
   * @param type Type of dependency - hard (required) or soft (recommended)
   * @param condition Optional condition that determines if dependency applies
   */
  addDependency(
    sourceStepId: string,
    targetStepId: string,
    type: 'hard' | 'soft' = 'hard',
    condition?: () => boolean
  ): void {
    this.dependencies.push({
      sourceStepId,
      targetStepId,
      type,
      condition
    });
    
    // Update dependency graph
    this.updateGraph(sourceStepId, targetStepId);
  }
  
  /**
   * Updates the dependency graph with a new relationship
   */
  private updateGraph(sourceStepId: string, targetStepId: string): void {
    // Create source node if it doesn't exist
    if (!this.dependencyGraph.has(sourceStepId)) {
      this.dependencyGraph.set(sourceStepId, {
        stepId: sourceStepId,
        dependencies: [],
        dependents: []
      });
    }
    
    // Create target node if it doesn't exist
    if (!this.dependencyGraph.has(targetStepId)) {
      this.dependencyGraph.set(targetStepId, {
        stepId: targetStepId,
        dependencies: [],
        dependents: []
      });
    }
    
    // Update relationships
    const sourceNode = this.dependencyGraph.get(sourceStepId)!;
    const targetNode = this.dependencyGraph.get(targetStepId)!;
    
    if (!sourceNode.dependencies.includes(targetStepId)) {
      sourceNode.dependencies.push(targetStepId);
    }
    
    if (!targetNode.dependents.includes(sourceStepId)) {
      targetNode.dependents.push(sourceStepId);
    }
  }
  
  /**
   * Checks if the step dependencies form a circular reference
   * 
   * @param stepId The step ID to check for circular dependencies
   * @returns True if circular dependency is detected, false otherwise
   */
  hasCircularDependency(stepId: string): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const checkCycle = (currentId: string): boolean => {
      // If already visited and not in current recursion path, we know it's safe
      if (visited.has(currentId) && !recursionStack.has(currentId)) {
        return false;
      }
      
      // If in current recursion path, we found a cycle
      if (recursionStack.has(currentId)) {
        return true;
      }
      
      // Mark current node as visited and add to recursion stack
      visited.add(currentId);
      recursionStack.add(currentId);
      
      // Check all dependencies
      const node = this.dependencyGraph.get(currentId);
      if (node) {
        for (const dependencyId of node.dependencies) {
          if (checkCycle(dependencyId)) {
            return true;
          }
        }
      }
      
      // Remove from recursion stack when backtracking
      recursionStack.delete(currentId);
      return false;
    };
    
    return checkCycle(stepId);
  }
  
  /**
   * Validates all dependencies in the graph for circular references
   * 
   * @returns Array of step IDs that have circular dependencies
   */
  validateDependencies(): string[] {
    const stepsWithCircularDeps: string[] = [];
    
    for (const [stepId] of this.dependencyGraph) {
      if (this.hasCircularDependency(stepId)) {
        stepsWithCircularDeps.push(stepId);
      }
    }
    
    return stepsWithCircularDeps;
  }
  
  /**
   * Determines if a step can be accessed based on its dependencies
   * 
   * @param stepId The step ID to check
   * @param completedStepIds Array of completed step IDs
   * @returns True if the step can be accessed, false otherwise
   */
  canAccessStep(stepId: string, completedStepIds: string[]): boolean {
    const node = this.dependencyGraph.get(stepId);
    if (!node) return true; // If not in graph, no dependencies
    
    // Check all dependencies
    for (const dependencyId of node.dependencies) {
      // Find the dependency relationship
      const dependency = this.dependencies.find(
        d => d.sourceStepId === stepId && d.targetStepId === dependencyId
      );
      
      // Skip if dependency doesn't exist or has a condition that evaluates to false
      if (!dependency || (dependency.condition && !dependency.condition())) {
        continue;
      }
      
      // For hard dependencies, the dependency must be completed
      if (dependency.type === 'hard' && !completedStepIds.includes(dependencyId)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Gets all steps that depend on a given step
   * 
   * @param stepId The step ID to find dependents for
   * @returns Array of dependent step IDs
   */
  getDependentSteps(stepId: string): string[] {
    const node = this.dependencyGraph.get(stepId);
    return node ? [...node.dependents] : [];
  }
  
  /**
   * Gets all steps that a given step depends on
   * 
   * @param stepId The step ID to find dependencies for
   * @returns Array of dependency step IDs
   */
  getDependencies(stepId: string): string[] {
    const node = this.dependencyGraph.get(stepId);
    return node ? [...node.dependencies] : [];
  }
  
  /**
   * Determines the next logical steps based on completed steps
   * 
   * @param completedStepIds Array of completed step IDs
   * @param allSteps Array of all available steps
   * @returns Array of step IDs that can be taken next
   */
  getNextAvailableSteps(completedStepIds: string[], allSteps: TourStep[]): TourStep[] {
    return allSteps.filter(step => {
      // If step is already completed, it's not "next"
      if (completedStepIds.includes(step.id)) {
        return false;
      }
      
      // Check if all dependencies are satisfied
      return this.canAccessStep(step.id, completedStepIds);
    });
  }
  
  /**
   * Builds a dependency manager from a tour path
   * 
   * @param tourPath The tour path to analyze for dependencies
   * @returns A configured dependency manager
   */
  static fromTourPath(tourPath: TourPath): TourDependencyManager {
    const manager = new TourDependencyManager();
    
    // Process explicit dependencies defined in step metadata
    tourPath.steps.forEach(step => {
      if (step.metadata?.dependencies) {
        const dependencies = step.metadata.dependencies as string[];
        dependencies.forEach(depId => {
          manager.addDependency(
            step.id,
            depId,
            step.metadata?.dependencyType as 'hard' | 'soft' || 'hard'
          );
        });
      }
    });
    
    return manager;
  }
}

/**
 * Factory function to create a dependency between steps
 */
export function createStepDependency(
  sourceStepId: string,
  targetStepId: string,
  type: 'hard' | 'soft' = 'hard',
  condition?: () => boolean
): { sourceStepId: string; targetStepId: string; type: 'hard' | 'soft'; condition?: () => boolean } {
  return {
    sourceStepId,
    targetStepId,
    type,
    condition
  };
}

/**
 * Enhancer that adds dependencies to a step
 */
export function dependentStep(
  dependencies: string | string[],
  type: 'hard' | 'soft' = 'hard'
) {
  return (step: TourStep): TourStep => {
    const deps = Array.isArray(dependencies) ? dependencies : [dependencies];
    
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        dependencies: deps,
        dependencyType: type
      }
    };
  };
}

/**
 * Enhancer that adds branching logic to a step
 */
export function branchingStep(
  branches: {
    condition: () => boolean;
    targetStepId: string;
    label?: string;
  }[]
) {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata: {
        ...(step.metadata || {}),
        branches
      },
      actions: {
        ...(step.actions || {}),
        next: {
          ...(step.actions?.next || {}),
          onClick: () => {
            // This will be processed by the tour controller to determine the next step
            return { type: 'BRANCH', branches };
          }
        }
      }
    };
  };
}
