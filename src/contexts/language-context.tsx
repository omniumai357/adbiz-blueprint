
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Define the context type
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  languages: { code: string; name: string }[];
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ]
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  // Change language function
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Update current language when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
      // Update html lang attribute
      document.documentElement.setAttribute('lang', i18n.language);
      // Update text direction for RTL languages if needed
      // if (['ar', 'he'].includes(i18n.language)) {
      //   document.documentElement.setAttribute('dir', 'rtl');
      // } else {
      //   document.documentElement.setAttribute('dir', 'ltr');
      // }
    };

    // Set initial language
    handleLanguageChanged();

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
