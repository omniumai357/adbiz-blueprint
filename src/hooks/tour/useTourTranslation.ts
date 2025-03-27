import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { TourStep } from '@/contexts/tour/types';

type TranslationKeys = {
  title?: string;
  content?: string;
  actions?: {
    next?: string;
    prev?: string;
    skip?: string;
    finish?: string;
  }
  aria?: {
    description?: string;
    navigation?: string;
  }
};

/**
 * Hook to provide translations for tour steps
 * 
 * @returns Functions and utilities for translating tour content
 */
export function useTourTranslation() {
  const { t } = useTranslation('tour');
  const { currentLanguage, direction } = useLanguage();
  
  // Functions for translating tour content
  const translateStep = useMemo(() => (
    step: TourStep, 
    keys?: TranslationKeys
  ): TourStep => {
    if (!step) return step;
    
    // Start with the original step
    const translatedStep = { ...step };
    
    // Apply translations based on provided keys
    if (keys?.title) {
      translatedStep.title = t(keys.title);
    }
    
    if (keys?.content) {
      translatedStep.content = t(keys.content);
    }
    
    // Translate actions if specified
    if (keys?.actions) {
      translatedStep.actions = translatedStep.actions || {};
      
      if (step?.actions?.next?.text) {
        const nextLabel = t(step.actions.next.text, step.actions.next.text);
        translatedStep.actions.next = translatedStep.actions.next || {};
        translatedStep.actions.next.text = nextLabel;
      }
      
      if (step?.actions?.prev?.text) {
        const prevLabel = t(step.actions.prev.text, step.actions.prev.text);
        translatedStep.actions.prev = translatedStep.actions.prev || {};
        translatedStep.actions.prev.text = prevLabel;
      }
      
      if (step?.actions?.skip?.text) {
        const skipLabel = t(step.actions.skip.text, step.actions.skip.text);
        translatedStep.actions.skip = translatedStep.actions.skip || {};
        translatedStep.actions.skip.text = skipLabel;
      }
      
      if (keys.actions.finish && translatedStep.actions) {
        translatedStep.actions.finish = translatedStep.actions.finish || {};
        translatedStep.actions.finish.text = t(keys.actions.finish);
      }
    }
    
    // Add ARIA translations if specified
    if (keys?.aria) {
      translatedStep.a11y = translatedStep.a11y || {};
      
      if (keys.aria.description) {
        translatedStep.a11y.description = t(keys.aria.description);
      }
      
      if (keys.aria.navigation) {
        translatedStep.a11y.navigationDescription = t(keys.aria.navigation);
      }
    }
    
    // Handle RTL-specific adjustments for tour elements
    if (direction === 'rtl' && translatedStep.placement) {
      // Adjust placement for RTL languages
      const placementMap: Record<string, string> = {
        'left': 'right',
        'left-start': 'right-start',
        'left-end': 'right-end',
        'right': 'left',
        'right-start': 'left-start',
        'right-end': 'left-end'
      };
      
      if (placementMap[translatedStep.placement]) {
        translatedStep.placement = placementMap[translatedStep.placement];
      }
    }
    
    return translatedStep;
  }, [t, direction]);
  
  // Function to translate multiple steps
  const translateSteps = useMemo(() => (
    steps: TourStep[], 
    keyMap: Record<string, TranslationKeys>
  ): TourStep[] => {
    return steps.map(step => {
      const keys = keyMap[step.id];
      return keys ? translateStep(step, keys) : step;
    });
  }, [translateStep]);
  
  // Helper functions for common tour texts
  const tourTexts = useMemo(() => ({
    next: t('next'),
    previous: t('previous'),
    finish: t('finish'),
    skip: t('skip'),
    tooltipInfo: (current: number, total: number) => 
      t('tooltipInfo', { current: current + 1, total }),
    welcome: t('welcome'),
    pauseTour: t('pauseTour'),
    resumeTour: t('resumeTour'),
    keyboardShortcuts: t('keyboardShortcuts'),
    earnPoints: t('earnPoints'),
    // Accessibility texts
    navigationHelp: t('a11y.navigationHelp', 'Use arrow keys to navigate, Escape to exit'),
    currentStepInfo: (current: number, total: number) =>
      t('a11y.currentStepInfo', 'Step {{current}} of {{total}}', { current: current + 1, total }),
    tourComplete: t('a11y.tourComplete', 'Tour completed'),
    tourStarted: t('a11y.tourStarted', 'Tour started'),
    stepChanged: t('a11y.stepChanged', 'Moved to step {{step}}'),
  }), [t, currentLanguage]);
  
  return {
    translateStep,
    translateSteps,
    tourTexts,
    currentLanguage,
    direction
  };
}
