
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Define the context type with additional properties
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  languages: { code: string; name: string; nativeName: string }[];
  isChangingLanguage: boolean;
  direction: 'ltr' | 'rtl';
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  languages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Español', nativeName: 'Español' },
    { code: 'fr', name: 'Français', nativeName: 'Français' }
  ],
  isChangingLanguage: false,
  direction: 'ltr'
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Enhanced language definitions with native names
  const languages = useMemo(() => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Español', nativeName: 'Español' },
    { code: 'fr', name: 'Français', nativeName: 'Français' }
  ], []);

  // Enhanced change language function with loading state
  const changeLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    
    setIsChangingLanguage(true);
    
    // Small timeout to allow UI to show loading state
    setTimeout(() => {
      i18n.changeLanguage(lang)
        .finally(() => {
          // Short delay before hiding loading indicator for better UX
          setTimeout(() => setIsChangingLanguage(false), 150);
        });
    }, 50);
  };

  // Update current language and direction when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
      
      // Update html lang attribute
      document.documentElement.setAttribute('lang', i18n.language);
      
      // Set text direction for RTL languages
      const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
      const isRtl = rtlLanguages.includes(i18n.language);
      
      setDirection(isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      
      // Add/remove RTL class to body for global styling
      if (isRtl) {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    };

    // Set initial language
    handleLanguageChanged();

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Memoized context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    languages,
    isChangingLanguage,
    direction
  }), [currentLanguage, languages, isChangingLanguage, direction]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
