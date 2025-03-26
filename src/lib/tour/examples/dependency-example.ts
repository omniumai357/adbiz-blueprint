
/**
 * This file contains examples of using the dependency system
 * in the tour component.
 */

import { createTourPath, createStep, enhanceStep } from '../core/tourPathFactory';
import { 
  dependentStep, 
  branchingStep, 
  reEntryPoint, 
  sectionStep 
} from '../core/dependency/enhancers';
import { TourDependencyManager, createStepDependency } from '../core/dependency';

// Example 1: Simple sequential dependency
const simpleSequentialPath = createTourPath('simple-sequential', [
  createStep('intro', 'intro', 'Introduction', 'This is the first step', 'bottom'),
  
  // Step that depends on the intro step
  dependentStep(
    createStep('features', 'features', 'Features', 'This shows all the features', 'top'),
    'intro' // Dependent on intro step
  ),
  
  // Step that depends on the features step
  dependentStep(
    createStep('conclusion', 'conclusion', 'Conclusion', 'This is the final step', 'right'),
    'features' // Dependent on features step
  )
]);

// Example 2: Branching path with conditional step
const branchingExamplePath = createTourPath('branching-example', [
  createStep('start', 'start', 'Start', 'This is the starting point', 'bottom'),
  
  // Branch based on a condition
  branchingStep(
    createStep('branch-point', 'branch-point', 'Branch Point', 'The tour will branch from here', 'top'),
    () => Math.random() > 0.5, // Condition
    'path-a-1', // True path
    'path-b-1'  // False path
  ),
  
  // Path A steps
  createStep('path-a-1', 'path-a-1', 'Path A - Step 1', 'You are on path A, step 1', 'right'),
  
  createStep('path-a-2', 'path-a-2', 'Path A - Step 2', 'You are on path A, step 2', 'right'),
  
  // Path B steps
  createStep('path-b-1', 'path-b-1', 'Path B - Step 1', 'You are on path B, step 1', 'left'),
  
  createStep('path-b-2', 'path-b-2', 'Path B - Step 2', 'You are on path B, step 2', 'left'),
  
  // Re-entry point where both paths converge
  reEntryPoint(
    createStep('convergence', 'convergence', 'Convergence', 'Both paths converge here', 'bottom'),
    ['path-a-2', 'path-b-2'] // Steps that lead to this one
  ),
  
  // Final step after convergence
  createStep('final', 'final', 'Final Step', 'This is the final step of the tour', 'bottom')
]);

// Export examples
export const dependencyExamples = {
  simpleSequentialPath,
  branchingExamplePath
};
