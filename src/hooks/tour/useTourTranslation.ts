
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
    
    // Set close button text
    if (!translatedStep.actions.close) {
      translatedStep.actions.close = {};
    }
    translatedStep.actions.close.text = translatedStep.actions.close.text || 'Close';
    
    return translatedStep;
  }, []);
  
  // Translate content based on language preference
  const translateContent = useCallback((step: TourStep): TourStep => {
    // This would typically involve looking up translations in a dictionary
    // For simplicity, we're just returning the original step
    return step;
  }, []);
  
  // Handle RTL languages by adjusting positions
  const adjustPositionForRTL = useCallback((step: TourStep, isRTL: boolean): TourStep => {
    if (!isRTL) return step;
    
    // Create a new step object to avoid mutating the original
    const adjustedStep = { ...step };
    
    // Flip horizontal positions for RTL languages
    if (step.position === 'left') {
      adjustedStep.position = 'right';
    } else if (step.position === 'right') {
      adjustedStep.position = 'left';
    }
    
    // Ensure the position is always a valid TourPosition type
    const safePosition: TourPosition = (adjustedStep.position as TourPosition) || 'bottom';
    adjustedStep.position = safePosition;
    
    return adjustedStep;
  }, []);
  
  return {
    translateButtons,
    translateContent,
    adjustPositionForRTL
  };
}
