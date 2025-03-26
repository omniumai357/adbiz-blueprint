
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
 * @param condition Function that returns true if step should be shown
 * @returns A function that enhances the step with a condition
 */
export function conditionalStep(
  condition: ConditionEvaluator
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      condition
    };
  };
}

/**
 * Creates a role-restricted step that only shows for specific user roles
 * 
 * @param roles Array of user roles that can see this step
 * @returns A function that enhances the step with role restrictions
 */
export function roleRestrictedStep(
  roles: StepUserRole[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      userRoles: roles
    };
  };
}

/**
 * Adds animation effects to a tour step
 * 
 * @param animation Animation configuration objects
 * @returns A function that enhances the step with animations
 */
export function animatedStep(
  animation: {
    entry?: string;
    exit?: string;
    highlight?: string;
  } = { entry: "fade-in", highlight: "pulse" }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      animation
    };
  };
}

/**
 * Creates an optional step that can be skipped
 * 
 * @returns A function that enhances the step, marking it as optional
 */
export function optionalStep(): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      isOptional: true
    };
  };
}

/**
 * Adds media content to a tour step
 * 
 * @param media Media configuration object
 * @returns A function that enhances the step with media
 */
export function mediaEnhancedStep(
  media: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      media
    };
  };
}

/**
 * Adds custom button actions to a tour step
 * 
 * @param actions Custom action configuration
 * @returns A function that enhances the step with custom actions
 */
export function actionEnhancedStep(
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
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      actions
    };
  };
}

/**
 * Adds event triggers to a tour step
 * 
 * @param triggers Array of trigger configurations
 * @returns A function that enhances the step with triggers
 */
export function triggerEnhancedStep(
  triggers: StepTrigger[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      triggers
    };
  };
}

/**
 * Sets the priority of a tour step
 * 
 * @param priority Priority level (higher numbers = higher priority)
 * @returns A function that enhances the step with priority
 */
export function prioritizedStep(
  priority: number
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      priority
    };
  };
}

/**
 * Adds metadata to a tour step
 * 
 * @param metadata Object containing arbitrary metadata
 * @returns A function that enhances the step with metadata
 */
export function metadataEnhancedStep(
  metadata: Record<string, any>
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      metadata
    };
  };
}

/**
 * Creates a step with dynamic content that can be loaded asynchronously
 * 
 * @param contentProvider Function that returns content string or Promise<string>
 * @returns A function that enhances the step with dynamic content loading capability
 */
export function dynamicContentStep(
  contentProvider: DynamicContentProvider
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
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
  };
}

/**
 * Creates a step with feature flag condition
 * 
 * @param featureFlag Feature flag name to check
 * @returns A function that enhances the step with a feature flag condition
 */
export function featureFlagStep(
  featureFlag: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const condition = () => {
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
    };
    
    return {
      ...step,
      condition
    };
  };
}

/**
 * Creates a step that's shown based on user's tour completion history
 * 
 * @param requiredCompletedTours Array of tour IDs that must be completed
 * @returns A function that enhances the step to check tour completion
 */
export function progressBasedStep(
  requiredCompletedTours: string[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const condition = () => {
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      return requiredCompletedTours.every(tourId => completedTours.includes(tourId));
    };
    
    return {
      ...step,
      condition
    };
  };
}

/**
 * Utility function to combine multiple step enhancers
 * 
 * @param step Base tour step
 * @param enhancers Function that enhances the step
 * @returns The fully enhanced tour step
 */
export function enhanceStep(
  step: TourStep,
  enhancer: (step: TourStep) => TourStep
): TourStep {
  return enhancer(step);
}
