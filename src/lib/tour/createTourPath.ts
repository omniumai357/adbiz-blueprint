
import { TourPath, TourStep, StepUserRole, StepTrigger } from "@/contexts/tour-context";
import { DynamicContentProvider, ConditionEvaluator } from "@/hooks/tour/analytics/types";

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
 * Creates a basic tour step with required fields
 * 
 * @param id Unique step identifier
 * @param elementId Target DOM element ID
 * @param title Step title
 * @param content Step content
 * @param position Position relative to target element
 * @returns A basic TourStep
 */
export function createStep(
  id: string,
  elementId: string,
  title: string,
  content: string,
  position: "top" | "right" | "bottom" | "left" = "bottom"
): TourStep {
  return {
    id,
    elementId,
    title,
    content,
    position
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
  condition: ConditionEvaluator
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
 * Creates a step with dynamic content that can be loaded asynchronously
 * 
 * @param step Base tour step to enhance
 * @param contentProvider Function that returns content string or Promise<string>
 * @returns Enhanced step with dynamic content loading capability
 */
export function dynamicContentStep(
  step: TourStep,
  contentProvider: DynamicContentProvider
): TourStep {
  const originalContent = step.content;
  
  return {
    ...step,
    // Store the original content as fallback
    metadata: {
      ...step.metadata,
      originalContent,
      dynamicContentProvider: contentProvider
    },
    // We'll replace this in the tour controller when the step is loaded
    content: originalContent
  };
}

/**
 * Creates a step with feature flag condition
 * 
 * @param step Base tour step
 * @param featureFlag Feature flag name to check
 * @returns Step that only appears when feature flag is enabled
 */
export function featureFlagStep(
  step: TourStep,
  featureFlag: string
): TourStep {
  return conditionalStep(step, () => {
    // Simple feature flag check implementation
    // In a real app, this would use your feature flag system
    const enabledFlags = localStorage.getItem('enabledFeatureFlags');
    if (!enabledFlags) return false;
    
    try {
      const flags = JSON.parse(enabledFlags);
      return !!flags[featureFlag];
    } catch (e) {
      return false;
    }
  });
}

/**
 * Creates a step that's shown based on user's tour completion history
 * 
 * @param step Base tour step
 * @param requiredCompletedTours Array of tour IDs that must be completed
 * @returns Step that only appears when user has completed specified tours
 */
export function progressBasedStep(
  step: TourStep,
  requiredCompletedTours: string[]
): TourStep {
  return conditionalStep(step, () => {
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    return requiredCompletedTours.every(tourId => completedTours.includes(tourId));
  });
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
