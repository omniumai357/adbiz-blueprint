
import { TourStep, TourPath } from './types';

/**
 * Creates a simple tour path from an array of steps
 * 
 * @param steps Array of tour steps
 * @returns A tour path
 */
const tourPathCreator = (steps: TourStep[]): TourPath => {
  return {
    id: `path-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Generated Tour Path',
    steps,
    allowSkip: true,
    showProgress: true,
    getStep: (index: number) => steps[index] || null,
    getStepById: (id: string) => steps.find(step => step.id === id) || null,
    getStepIndex: (id: string) => steps.findIndex(step => step.id === id),
    getAllSteps: () => [...steps],
    config: {
      allowSkip: true,
      showProgress: true
    }
  };
};

export default tourPathCreator;
