
/**
 * Type for tour navigation actions
 */
export type NavigationAction = 
  | 'next_keyboard_shortcut'
  | 'previous_keyboard_shortcut'
  | 'next_from_element'
  | 'escape'
  | 'show_shortcuts_help'
  | 'skip_keyboard_shortcut'
  | 'first_step'
  | 'last_step'
  | 'jump_forward'
  | 'jump_back';

/**
 * Configuration options for keyboard navigation
 */
export interface KeyboardHandlerOptions {
  isActive: boolean;
  isRTL?: boolean;
  enableHomeEndKeys?: boolean;
  enablePageKeys?: boolean;
  pageKeyJumpSize?: number;
  enableShortcutsHelp?: boolean;
}
