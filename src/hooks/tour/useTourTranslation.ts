
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
  }
};

/**
 * Hook to provide translations for tour steps
 * 
 * @returns Functions and utilities for translating tour content
 */
export function useTourTranslation() {
  const { t } = useTranslation('tour');
  const { currentLanguage } = useLanguage();
  
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
      translatedStep.actions = { ...step.actions };
      
      if (keys.actions.next && translatedStep.actions) {
        translatedStep.actions.next = {
          ...translatedStep.actions.next,
          label: t(keys.actions.next)
        };
      }
      
      if (keys.actions.prev && translatedStep.actions) {
        translatedStep.actions.prev = {
          ...translatedStep.actions.prev,
          label: t(keys.actions.prev)
        };
      }
      
      if (keys.actions.skip && translatedStep.actions) {
        translatedStep.actions.skip = {
          ...translatedStep.actions.skip,
          label: t(keys.actions.skip)
        };
      }
    }
    
    return translatedStep;
  }, [t]);
  
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
    earnPoints: t('earnPoints')
  }), [t, currentLanguage]);
  
  return {
    translateStep,
    translateSteps,
    tourTexts
  };
}
