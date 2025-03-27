
/**
 * Represents a dependency relationship between steps
 */
export interface StepDependency {
  sourceStepId: string;
  targetStepId: string;
  type: 'hard' | 'soft'; // hard = must complete, soft = should complete
  condition?: () => boolean;
}

/**
 * Represents a node in the dependency graph
 */
export interface DependencyNode {
  stepId: string;
  dependencies: string[]; // IDs of steps this step depends on
  dependents: string[]; // IDs of steps that depend on this step
}

/**
 * Represents a branch condition for step navigation
 */
export interface BranchCondition {
  condition: () => boolean;
  targetStepId: string;
  label?: string;
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  elementId?: string;
  position?: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  placement?: string;
  a11y?: {
    description?: string;
    navigationDescription?: string;
    focusStrategy?: 'first-interactive' | 'specific-element' | 'none';
    focusSelector?: string;
    removeAriaHidden?: boolean;
    announceOnEnter?: boolean;
    srOnly?: string;
  };
  actions?: {
    next?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    finish?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
  };
  condition?: () => boolean | Promise<boolean>;
  onBeforeStep?: () => Promise<boolean> | boolean;
  onAfterStep?: () => void;
  delay?: number;
  animation?: string | {
    entry?: string;
    highlight?: string;
    exit?: string;
  };
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  disableOverlay?: boolean;
  disableScrolling?: boolean;
  disableCloseOnEsc?: boolean;
  disableCloseOnClickOutside?: boolean;
  disableKeyboardNavigation?: boolean;
  spotlightPadding?: number;
  isOptional?: boolean;
  showProgress?: boolean;
  floatingUIOptions?: any;
  highlightClass?: string;
  effects3D?: {
    enable?: boolean;
    intensity?: number;
  };
  metadata?: Record<string, any>;
  dependencies?: string[];
  triggers?: {
    event: string;
    element?: string;
    condition?: () => boolean;
    action: () => void;
  }[];
  priority?: number;
  userRoles?: string[];
  path?: string | {
    enabled: boolean;
    targetElementId: string;
    style: string;
    color?: string;
    animationDuration?: number;
    showArrow?: boolean;
    waypoints?: Array<{x: number, y: number}>;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high"; 
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  keyboardShortcuts?: Record<string, string>;
  waypoints?: Array<{x: number, y: number}>;
  enabled?: boolean;
  targetElementId?: string;
  style?: string;
  color?: string;
  animationDuration?: number;
  showArrow?: boolean;
}

// Add the TourStepGroup interface
export interface TourStepGroup {
  id: string;
  title: string;
  description?: string;
  steps: TourStep[];
  condition?: () => boolean;
}

/**
 * Represents a complete tour path with steps and configuration
 */
export interface TourPath {
  id: string;
  name?: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  route?: string;
  getStep?: (index: number) => TourStep | null;
  getStepById?: (id: string) => TourStep | null;
  getStepIndex?: (id: string) => number;
  getAllSteps?: () => TourStep[];
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    completionCallback?: () => void;
    metadata?: {
      route?: string;
      tags?: string[];
      userRoles?: string[];
      [key: string]: any;
    };
    accessibility?: {
      announceSteps?: boolean;
      keyboardNavigation?: boolean;
      restoreFocus?: boolean;
      focusTrap?: boolean;
      focusManagement?: {
        initialFocus?: 'first-interactive' | 'specific-element' | 'manual' | 'none';
        restoreFocus?: boolean;
        visualFocusRing?: boolean;
        enhancedFocusVisibility?: boolean;
        autoSkipNavigationOptions?: boolean;
      };
      screenReader?: {
        announceStepChanges?: boolean;
        describeActions?: boolean;
        politeAnnouncements?: boolean;
        srOnlyInstructions?: boolean;
      };
    };
  };
}
