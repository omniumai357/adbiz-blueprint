
// Re-export everything from the new navigation modules
export { handleKeyNavigation } from './navigation/keyboard-handler';
export { handleNavigationAction, parseNavigationAction } from './navigation/navigation-actions';
export { useMobileKeyboardDetection } from './navigation/mobile-detection';
export type { NavigationAction, KeyboardHandlerOptions } from './navigation/types';
