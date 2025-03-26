
// Re-export core tour path and step creation functions
export { 
  createTourPath,
  createTourPathFromGroups,
  createStep,
  enhanceStep
} from './core/tourPathFactory';

// Re-export step group functions
export {
  createStepGroup,
  getStepGroup,
  getAllStepGroups,
  composeStepGroups,
  stepInGroup
} from './core/tourStepGroups';

// Re-export tour composition utilities
export {
  createCustomTour,
  createOnboardingTour,
  createFeatureTour,
  getStepGroupsByTag
} from './utils/tour-composer';

// Re-export condition enhancers
export { 
  conditionalStep,
  featureFlagStep,
  progressBasedStep
} from './enhancers/conditionEnhancers';

// Re-export role enhancers
export { 
  roleRestrictedStep 
} from './enhancers/roleEnhancers';

// Re-export visual enhancers
export { 
  animatedStep,
  optionalStep,
  mediaEnhancedStep
} from './enhancers/visualEnhancers';

// Re-export action enhancers
export { 
  actionEnhancedStep,
  triggerEnhancedStep,
  prioritizedStep
} from './enhancers/actionEnhancers';

// Re-export content enhancers
export { 
  metadataEnhancedStep,
  dynamicContentStep
} from './enhancers/contentEnhancers';

// Re-export existing tour paths for backward compatibility
export { defaultTourPath } from './default-tour';
export { homeTourPath } from './home-tour';
export { contactTourPath } from './contact-tour';
export { servicesTourPath } from './services-tour';
export { checkoutTourPath } from './checkout-tour';

// Re-export analytics exports for backward compatibility
export * from './exportAnalytics';
