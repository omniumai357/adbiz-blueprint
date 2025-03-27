
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Language } from '@/contexts/language/types';

export interface LanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Shared hook for language selector components that provides common logic
 * and state management for handling language selection
 */
export function useLanguageSelector(props: LanguageSelectorProps) {
  const { 
    showNativeNames = false,
    showFlags = true
  } = props;
  
  const { t } = useTranslation('language');
  const { 
    currentLanguage, 
    changeLanguage, 
    languages, 
    isChangingLanguage, 
    direction 
  } = useLanguage();

  /**
   * Changes the application language if it's different from the current one
   * and not currently in the process of changing
   */
  const handleLanguageChange = async (langCode: string) => {
    if (isChangingLanguage || langCode === currentLanguage) return;
    await changeLanguage(langCode);
  };

  /**
   * Gets the display name for a language based on the showNativeNames preference
   */
  const getLanguageDisplayName = (lang: Language) => {
    return showNativeNames ? lang.nativeName : lang.name;
  };

  /**
   * Gets the current language object from the list of available languages
   */
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Common accessibility labels
  const ariaLabels = {
    button: t('selectLanguage'),
    dropdown: t('availableLanguages', 'Available languages'),
    selected: t('currentLanguage', 'Current language: {{language}}', { 
      language: getLanguageDisplayName(getCurrentLanguage()) 
    })
  };

  // Return all the shared state and handlers
  return {
    currentLanguage,
    languages,
    isChangingLanguage,
    direction,
    isRTL: direction === 'rtl',
    handleLanguageChange,
    getCurrentLanguage,
    getLanguageDisplayName,
    showFlags,
    showNativeNames,
    ariaLabels,
    t
  };
}
