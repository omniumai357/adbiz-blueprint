
import { TourPath, TourStep, StepUserRole, StepTrigger } from "@/contexts/tour-context";

/**
 * Helper function to create tour paths with conditional steps
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param steps Array of tour steps
 * @param options Additional tour path configuration options
 * @returns A configured TourPath object
 */
export function createTourPath(
  id: string,
  name: string,
  steps: TourStep[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    requiredUserRoles?: StepUserRole[];
    completionCallback?: () => void;
    metadata?: Record<string, any>;
  }
): TourPath {
  return {
    id,
    name,
    steps,
    ...options
  };
}

/**
 * Creates a conditional step that only shows when the condition is true
 * 
 * @param step The tour step to make conditional
 * @param condition Function that returns true if step should be shown
 * @returns A configured TourStep with condition
 */
export function conditionalStep(
  step: TourStep,
  condition: () => boolean
): TourStep {
  return {
    ...step,
    condition
  };
}

/**
 * Creates a role-restricted step that only shows for specific user roles
 * 
 * @param step The tour step to restrict by role
 * @param roles Array of user roles that can see this step
 * @returns A configured TourStep with role restrictions
 */
export function roleRestrictedStep(
  step: TourStep,
  roles: StepUserRole[]
): TourStep {
  return {
    ...step,
    userRoles: roles
  };
}

/**
 * Adds animation effects to a tour step
 * 
 * @param step The tour step to enhance with animations
 * @param animation Animation configuration objects
 * @returns A configured TourStep with animations
 */
export function animatedStep(
  step: TourStep,
  animation: {
    entry?: string;
    exit?: string;
    highlight?: string;
  }
): TourStep {
  return {
    ...step,
    animation
  };
}

/**
 * Creates an optional step that can be skipped
 * 
 * @param step The tour step to make optional
 * @returns A configured TourStep marked as optional
 */
export function optionalStep(step: TourStep): TourStep {
  return {
    ...step,
    isOptional: true
  };
}

/**
 * Adds media content to a tour step
 * 
 * @param step The tour step to enhance with media
 * @param media Media configuration object
 * @returns A configured TourStep with media
 */
export function mediaEnhancedStep(
  step: TourStep,
  media: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
  }
): TourStep {
  return {
    ...step,
    media
  };
}

/**
 * Adds custom button actions to a tour step
 * 
 * @param step The tour step to enhance with custom actions
 * @param actions Custom action configuration
 * @returns A configured TourStep with custom actions
 */
export function actionEnhancedStep(
  step: TourStep,
  actions: {
    next?: {
      label?: string;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      onClick?: () => void;
    };
  }
): TourStep {
  return {
    ...step,
    actions
  };
}

/**
 * Adds event triggers to a tour step
 * 
 * @param step The tour step to enhance with triggers
 * @param triggers Array of trigger configurations
 * @returns A configured TourStep with triggers
 */
export function triggerEnhancedStep(
  step: TourStep,
  triggers: StepTrigger[]
): TourStep {
  return {
    ...step,
    triggers
  };
}

/**
 * Sets the priority of a tour step
 * 
 * @param step The tour step to set priority for
 * @param priority Priority level (higher numbers = higher priority)
 * @returns A configured TourStep with priority
 */
export function prioritizedStep(
  step: TourStep,
  priority: number
): TourStep {
  return {
    ...step,
    priority
  };
}

/**
 * Adds metadata to a tour step
 * 
 * @param step The tour step to add metadata to
 * @param metadata Object containing arbitrary metadata
 * @returns A configured TourStep with metadata
 */
export function metadataEnhancedStep(
  step: TourStep,
  metadata: Record<string, any>
): TourStep {
  return {
    ...step,
    metadata
  };
}

/**
 * Utility function to combine multiple step enhancers
 * 
 * @param step Base tour step
 * @param enhancers Array of functions that enhance the step
 * @returns The fully enhanced tour step
 */
export function enhanceStep(
  step: TourStep,
  ...enhancers: ((step: TourStep) => TourStep)[]
): TourStep {
  return enhancers.reduce((enhancedStep, enhancer) => enhancer(enhancedStep), step);
}
