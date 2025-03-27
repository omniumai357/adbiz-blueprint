
import { useCallback } from 'react';
import { TourStep } from '@/contexts/tour/types';

/**
 * Type-safe position values
 */
type TourPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Hook to handle translating tour content and labels
 */
export function useTourTranslation() {
  // Translate button labels
  const translateButtons = useCallback((step: TourStep): TourStep => {
    // Start with the original step
    const translatedStep = { ...step };
    
    // Check if actions exist
    if (!translatedStep.actions) {
      translatedStep.actions = {};
    }
    
    // Set next button text
    if (!translatedStep.actions.next) {
      translatedStep.actions.next = {};
    }
    translatedStep.actions.next.text = translatedStep.actions.next.text || 'Next';
    
    // Set prev button text
    if (!translatedStep.actions.prev) {
      translatedStep.actions.prev = {};
    }
    translatedStep.actions.prev.text = translatedStep.actions.prev.text || 'Back';
    
    // Set skip button text
    if (!translatedStep.actions.skip) {
      translatedStep.actions.skip = {};
    }
    translatedStep.actions.skip.text = translatedStep.actions.skip.text || 'Skip';
    
    // Set finish button text
    if (!translatedStep.actions.finish) {
      translatedStep.actions.finish = {};
    }
    translatedStep.actions.finish.text = translatedStep.actions.finish.text || 'Finish';
    
    // Initialize close button if needed
    if (!translatedStep.actions.close) {
      translatedStep.actions.close = {};
    }
    translatedStep.actions.close.text = translatedStep.actions.close.text || 'Close';
    
    return translatedStep;
  }, []);

  // Helper function to parse position
  const parsePosition = useCallback((position: string | undefined): TourPosition => {
    const validPositions: TourPosition[] = ['top', 'right', 'bottom', 'left'];
    
    if (!position || !validPositions.includes(position as TourPosition)) {
      return 'bottom';
    }
    
    return position as TourPosition;
  }, []);

  return {
    translateButtons,
    parsePosition
  };
}
