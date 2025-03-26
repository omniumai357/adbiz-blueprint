export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  elementId?: string;
  position?: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  placement?: string; // Added for RTL support
  a11y?: {
    description?: string;
    navigationDescription?: string;
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
    finish?: {  // Added for completion actions
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
  };
  condition?: () => boolean;
  onBeforeStep?: () => Promise<boolean> | boolean;
  onAfterStep?: () => void;
  delay?: number;
  animation?: string;
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
}
