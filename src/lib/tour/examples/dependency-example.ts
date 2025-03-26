
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
  createStep('intro', {
    title: 'Introduction',
    content: 'This is the first step',
    target: '#intro',
    position: 'bottom'
  }),
  
  // Step that depends on the intro step
  dependentStep(
    createStep('features', {
      title: 'Features',
      content: 'This shows all the features',
      target: '#features',
      position: 'top'
    }),
    'intro' // Dependent on intro step
  ),
  
  // Step that depends on the features step
  dependentStep(
    createStep('conclusion', {
      title: 'Conclusion',
      content: 'This is the final step',
      target: '#conclusion',
      position: 'right'
    }),
    'features' // Dependent on features step
  )
]);

// Example 2: Branching path with conditional step
const branchingExamplePath = createTourPath('branching-example', [
  createStep('start', {
    title: 'Start',
    content: 'This is the starting point',
    target: '#start',
    position: 'bottom'
  }),
  
  // Branch based on a condition
  branchingStep(
    createStep('branch-point', {
      title: 'Branch Point',
      content: 'The tour will branch from here',
      target: '#branch-point',
      position: 'top'
    }),
    () => Math.random() > 0.5, // Condition
    'path-a-1', // True path
    'path-b-1'  // False path
  ),
  
  // Path A steps
  createStep('path-a-1', {
    title: 'Path A - Step 1',
    content: 'You are on path A, step 1',
    target: '#path-a-1',
    position: 'right'
  }),
  
  createStep('path-a-2', {
    title: 'Path A - Step 2',
    content: 'You are on path A, step 2',
    target: '#path-a-2',
    position: 'right'
  }),
  
  // Path B steps
  createStep('path-b-1', {
    title: 'Path B - Step 1',
    content: 'You are on path B, step 1',
    target: '#path-b-1',
    position: 'left'
  }),
  
  createStep('path-b-2', {
    title: 'Path B - Step 2',
    content: 'You are on path B, step 2',
    target: '#path-b-2',
    position: 'left'
  }),
  
  // Re-entry point where both paths converge
  reEntryPoint(
    createStep('convergence', {
      title: 'Convergence',
      content: 'Both paths converge here',
      target: '#convergence',
      position: 'bottom'
    }),
    ['path-a-2', 'path-b-2'] // Steps that lead to this one
  ),
  
  // Final step after convergence
  createStep('final', {
    title: 'Final Step',
    content: 'This is the final step of the tour',
    target: '#final',
    position: 'bottom'
  })
]);

// Export examples
export const dependencyExamples = {
  simpleSequentialPath,
  branchingExamplePath
};
