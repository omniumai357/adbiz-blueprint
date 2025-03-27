
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Create a new tour step with given properties
 */
export function createTourStep(props: Partial<TourStep> & { id: string; target: string; title: string; content: string }): TourStep {
  return {
    id: props.id,
    target: props.target,
    title: props.title,
    content: props.content,
    position: props.position || 'bottom',
    placement: props.placement || props.position || 'bottom',
    elementId: props.elementId,
    // Add other properties with defaults
    ...props
  };
}

/**
 * Create a new tour path with given properties and steps
 */
export function createTourPath(props: Partial<TourPath> & { id: string; name: string; steps: TourStep[] }): TourPath {
  return {
    id: props.id,
    name: props.name,
    steps: props.steps,
    route: props.route,
    description: props.description,
    config: props.config,
    allowSkip: props.allowSkip,
    showProgress: props.showProgress,
    autoStart: props.autoStart
  };
}
