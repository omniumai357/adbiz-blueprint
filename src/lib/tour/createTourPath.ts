
import { TourStep, TourPath } from './types';

/**
 * Creates a simple tour path from an array of steps
 * 
 * @param steps Array of tour steps
 * @returns A tour path
 */
const tourPathCreator = (steps: TourStep[]): TourPath => {
  return {
    steps,
    length: steps.length,
    start: () => steps[0] || null,
    end: () => steps[steps.length - 1] || null,
    getStep: (index: number) => steps[index] || null,
    getStepById: (id: string) => steps.find(step => step.id === id) || null,
    getStepIndex: (id: string) => steps.findIndex(step => step.id === id),
    getAllSteps: () => [...steps],
  };
};

export default tourPathCreator;
