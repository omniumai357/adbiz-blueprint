
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';

export type NavigationHandler = {
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  goToStep: (stepIndex: number) => void;
  trackInteraction: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void;
  showKeyboardShortcutsHelp?: () => void;
};

export type NavigationAction = 
  | 'first_step'
  | 'last_step'
  | 'jump_forward'
  | 'jump_back'
  | 'show_shortcuts_help'
  | 'next_from_element' 
  | 'next_keyboard_shortcut'
  | 'previous_keyboard_shortcut'
  | 'skip_keyboard_shortcut'
  | 'escape';

export interface KeyboardHandlerOptions {
  isActive: boolean;
  currentPath: string | null;
  tourPaths: TourPath[];
  currentStep: number;
  totalSteps: number;
  visibleSteps: TourStep[];
  userId?: string;
  userType?: string;
  handlers: NavigationHandler;
  isMobileDevice?: boolean;
}
