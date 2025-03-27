
import { TourStep, TourPath } from '@/contexts/tour/types';

/**
 * Creates a step object with common properties
 */
export const createStep = (
  id: string,
  target: string,
  title: string,
  content: string,
  position: "top" | "right" | "bottom" | "left" = "bottom"
): TourStep => {
  return {
    id,
    target,
    title,
    content,
    position
  };
};

/**
 * Enhances a step with additional properties
 */
export const enhanceStep = (step: TourStep, enhancer: (step: TourStep) => Partial<TourStep>): TourStep => {
  const enhancements = enhancer(step);
  return {
    ...step,
    ...enhancements
  };
};

/**
 * Creates a tour path with the provided steps
 */
export const createTourPath = (steps: TourStep[], options?: Partial<Omit<TourPath, 'steps'>>): TourPath => {
  return {
    id: options?.id || 'default-tour',
    name: options?.name || 'Default Tour',
    steps,
    allowSkip: options?.allowSkip !== false,
    showProgress: options?.showProgress !== false,
    ...(options || {})
  };
};
