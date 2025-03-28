
import { useTourKeyboardNavigation as useTourKeyboardNavigationImpl } from './controller/navigation/keyboard-handler';

/**
 * Re-export the tour keyboard navigation hook from the new module structure
 * This maintains backward compatibility with existing code
 */
export const useTourKeyboardNavigation = useTourKeyboardNavigationImpl;
