
import { createTourPath } from '../core/paths';
import { TourStep } from '../types';

const steps: TourStep[] = [
  {
    id: 'dependency-step-1',
    title: 'First Step',
    content: 'This is the first step of the dependency example tour.',
    target: 'example-target-1',
    placement: 'bottom'
  },
  {
    id: 'dependency-step-2',
    title: 'Second Step',
    content: 'This step depends on the first step being completed.',
    target: 'example-target-2',
    placement: 'right',
    dependencies: ['dependency-step-1']
  },
  {
    id: 'dependency-step-3',
    title: 'Third Step',
    content: 'This step has multiple dependencies.',
    target: 'example-target-3',
    placement: 'top',
    dependencies: ['dependency-step-1', 'dependency-step-2']
  },
  {
    id: 'dependency-step-4',
    title: 'Final Step',
    content: 'This is the final step with conditional display.',
    target: 'example-target-4',
    placement: 'left',
    condition: () => {
      // Example condition that could check for user role, feature flag, etc.
      return true;
    }
  }
];

// Using the corrected createTourPath function signature
export const dependencyExampleTourPath = createTourPath(steps);

// Example of how to use the tour path with dependency checking
export const checkDependencies = (stepId: string): boolean => {
  const step = dependencyExampleTourPath.steps.find(s => s.id === stepId);
  if (!step || !step.dependencies || step.dependencies.length === 0) {
    return true; // No dependencies to check
  }
  
  // In a real implementation, you would check if each dependency step
  // has been completed by the user, perhaps using a store or context
  const completedSteps = ['dependency-step-1']; // Example of completed steps
  
  return step.dependencies.every(depId => completedSteps.includes(depId));
};
