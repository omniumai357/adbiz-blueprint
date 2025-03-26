
import { TourPath, TourStep } from '@/contexts/tour/types';
import { createTourPath } from '@/lib/tour/core/paths/createTourPath';
import { createStep } from '@/lib/tour/core/tourPathFactory';

/**
 * Example of a tour with dependencies between steps
 */
export const dependencyExampleTour: TourPath = createTourPath(
  'dependency-example-tour',
  'Dependency Example Tour',
  [
    createStep('step-1', 'element-1', 'First Step', 'This is the first step', 'bottom'),
    createStep('step-2', 'element-2', 'Second Step', 'This step depends on the first', 'top'),
    createStep('step-3', 'element-3', 'Third Step', 'This step has multiple dependencies', 'right')
  ],
  {
    allowSkip: true,
    showProgress: true,
    route: '/example'
  }
);
