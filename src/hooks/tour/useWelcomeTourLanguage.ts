
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to handle language functionality for the welcome tour modal
 */
export function useWelcomeTourLanguage() {
  const { t } = useTranslation('tour');
  const { currentLanguage } = useLanguage();
  
  // Update the tour welcome messages based on language
  useEffect(() => {
    // This could be extended to modify DOM elements if needed
    document.documentElement.setAttribute('data-tour-language', currentLanguage);
  }, [currentLanguage]);
  
  // Return translated welcome messages
  return {
    welcomeTitle: t('welcome'),
    welcomeDescription: t('earnPoints'),
    startButtonLabel: t('next'),
    skipButtonLabel: t('skip')
  };
}
