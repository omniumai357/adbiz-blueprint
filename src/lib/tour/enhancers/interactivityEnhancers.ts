
import { TourStep } from "@/contexts/tour/types";

/**
 * Enhances a step with interactive functionality for user interaction
 */
export function interactiveStep(options: {
  clickable?: boolean;
  delayBetweenClicks?: number;
  hoverEffect?: boolean;
  rippleEffect?: boolean;
  highlightOnInteraction?: boolean;
  customEventHandlers?: Record<string, () => void>;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultOptions = {
      clickable: true,
      delayBetweenClicks: 500,
      hoverEffect: true,
      rippleEffect: false,
      highlightOnInteraction: true,
      customEventHandlers: {}
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return {
      ...step,
      metadata: {
        ...step.metadata,
        interactivity: mergedOptions
      }
    };
  };
}

/**
 * Makes a step wait for a specific user action before proceeding
 */
export function waitForActionStep(options: {
  action: 'click' | 'hover' | 'focus' | 'custom';
  selector?: string;
  timeout?: number;
  timeoutAction?: 'skip' | 'retry' | 'end';
  customEvent?: string;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultOptions = {
      action: 'click' as const,
      timeout: 30000,
      timeoutAction: 'skip' as const
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return {
      ...step,
      metadata: {
        ...step.metadata,
        waitForAction: mergedOptions
      }
    };
  };
}

/**
 * Adds keyboard shortcut functionality to a tour step
 */
export function keyboardShortcutStep(shortcuts: {
  nextKey?: string;
  prevKey?: string;
  skipKey?: string;
  helpKey?: string;
  customShortcuts?: Record<string, () => void>;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultShortcuts = {
      nextKey: 'ArrowRight',
      prevKey: 'ArrowLeft',
      skipKey: 'Escape',
      helpKey: '?'
    };
    
    const mergedShortcuts = { ...defaultShortcuts, ...shortcuts };
    
    return {
      ...step,
      metadata: {
        ...step.metadata,
        keyboardShortcuts: mergedShortcuts
      }
    };
  };
}

/**
 * Adds swipe gesture support for mobile devices
 */
export function swipeGestureStep(options: {
  nextOnSwipeLeft?: boolean;
  prevOnSwipeRight?: boolean;
  skipOnSwipeDown?: boolean;
  threshold?: number;
}): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const defaultOptions = {
      nextOnSwipeLeft: true,
      prevOnSwipeRight: true,
      skipOnSwipeDown: false,
      threshold: 50
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return {
      ...step,
      metadata: {
        ...step.metadata,
        swipeGestures: mergedOptions
      }
    };
  };
}
