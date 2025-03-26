
// Export core functionality
export * from './core/paths/createTourPath';
export * from './core/paths/createTourPathFromGroups';
export * from './core/tourPathFactory';
export * from './core/tourStepGroups';

// Export enhancers
export * from './enhancers/visualEnhancers';
export * from './enhancers/actionEnhancers';
export * from './enhancers/contentEnhancers';
export * from './enhancers/dependencyEnhancers';
export * from './enhancers/interactivityEnhancers';
export * from './enhancers/pathEnhancers';
export * from './enhancers/roleEnhancers';

// Export utilities and helpers
export * from './utils/tour-composer/createCustomTour';
export * from './utils/tour-composer/createFeatureTour';
export * from './utils/tour-composer/createOnboardingTour';

// Core building blocks
export { createStep, enhanceStep } from './core/tourPathFactory';

// Common enhancers (directly exported for convenience)
import { 
  animatedStep, 
  optionalStep, 
  mediaEnhancedStep,
  spotlightStep,
  positionStep,
  visuallyEnhancedStep,
  transitionStep
} from './enhancers/visualEnhancers';

export {
  animatedStep,
  optionalStep,
  mediaEnhancedStep,
  spotlightStep,
  positionStep,
  visuallyEnhancedStep,
  transitionStep
};

// Utility types
export * from './types';
