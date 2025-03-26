
import { TourStep } from "@/contexts/tour/types";

/**
 * Adds dependencies to a tour step
 */
export const withDependencies = (
  dependencies: string[]
) => (step: TourStep): TourStep => {
  return {
    ...step,
    dependencies: [...(step.dependencies || []), ...dependencies]
  };
};

/**
 * Adds metadata to a tour step
 */
export const withMetadata = (
  key: string,
  value: any
) => (step: TourStep): TourStep => {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      [key]: value
    }
  };
};

/**
 * Sets a condition to a step based on a dependency
 */
export const withDependencyCondition = (
  dependencyId: string,
  condition: (dependency: any) => boolean
) => (step: TourStep): TourStep => {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      dependencyConditions: {
        ...(step.metadata?.dependencyConditions || {}),
        [dependencyId]: condition
      }
    }
  };
};

/**
 * Adds a callback to execute when a dependency resolves
 */
export const withDependencyCallback = (
  dependencyId: string,
  callback: (dependency: any) => void
) => (step: TourStep): TourStep => {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      dependencyCallbacks: {
        ...(step.metadata?.dependencyCallbacks || {}),
        [dependencyId]: callback
      }
    }
  };
};

/**
 * Makes a step await a dependency to resolve before showing
 */
export const withAwaitDependency = (
  dependencyId: string,
  timeout?: number
) => (step: TourStep): TourStep => {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      awaitDependency: dependencyId,
      dependencyTimeout: timeout
    }
  };
};

/**
 * Makes a step provide a value for other steps to depend on
 */
export const withDependencyProvider = (
  providerId: string,
  valueFactory: () => any
) => (step: TourStep): TourStep => {
  return {
    ...step,
    metadata: {
      ...(step.metadata || {}),
      dependencyProviders: {
        ...(step.metadata?.dependencyProviders || {}),
        [providerId]: valueFactory
      }
    }
  };
};

/**
 * Makes a step optional based on a dependency
 */
export const withOptionalDependency = (
  dependencyId: string,
  condition: (dependency: any) => boolean = () => true
) => (step: TourStep): TourStep => {
  return {
    ...step,
    isOptional: true,
    metadata: {
      ...(step.metadata || {}),
      optionalDependency: {
        id: dependencyId,
        condition
      }
    }
  };
};
