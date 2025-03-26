
import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { toast } from '@/hooks/use-toast';

// Define the context type with additional properties
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  languages: { 
    code: string; 
    name: string; 
    nativeName: string; 
    direction?: string;
    flag?: string;
    enabled?: boolean;
  }[];
  isChangingLanguage: boolean;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  languagePreference: {
    savePreference: (lang: string) => void;
    clearPreference: () => void;
    hasPreference: boolean;
  };
  setInitialLanguage: (langCode: string) => Promise<void>;
  isFallbackLanguage: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: async () => {},
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', enabled: true },
    { code: 'es', name: 'Español', nativeName: 'Español', direction: 'ltr', enabled: true },
    { code: 'fr', name: 'Français', nativeName: 'Français', direction: 'ltr', enabled: true }
  ],
  isChangingLanguage: false,
  direction: 'ltr',
  isRTL: false,
  languagePreference: {
    savePreference: () => {},
    clearPreference: () => {},
    hasPreference: false
  },
  setInitialLanguage: async () => {},
  isFallbackLanguage: false
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Storage keys
const LANGUAGE_STORAGE_KEY = 'userLanguagePreference';
const LANGUAGE_TIMESTAMP_KEY = 'userLanguageTimestamp';

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [isFallbackLanguage, setIsFallbackLanguage] = useState(false);
  const previousLanguage = useRef<string | null>(null);
  const changingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Enhanced language definitions with native names, directions, and flags
  const languages = useMemo(() => [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸', enabled: true },
    { code: 'es', name: 'Español', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', enabled: true },
    { code: 'fr', name: 'Français', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', enabled: true },
    // Future RTL languages
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦', enabled: false },
    { code: 'he', name: 'Hebrew', nativeName: 'עִברִית', direction: 'rtl', flag: '🇮🇱', enabled: false }
  ], []);

  // RTL language codes
  const rtlLanguages = useMemo(() => ['ar', 'he', 'fa', 'ur'], []);
  
  // Utility for language preference storage
  const languagePreference = useMemo(() => ({
    savePreference: (lang: string) => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        localStorage.setItem(LANGUAGE_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.warn('Failed to save language preference', error);
      }
    },
    clearPreference: () => {
      try {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_TIMESTAMP_KEY);
      } catch (error) {
        console.warn('Failed to clear language preference', error);
      }
    },
    hasPreference: Boolean(localStorage.getItem(LANGUAGE_STORAGE_KEY))
  }), []);

  // Set initial language based on stored preference or browser setting
  const setInitialLanguage = useCallback(async (forceLang?: string) => {
    let targetLang: string | null = null;
    
    // Priority: 1. Force parameter, 2. Local storage, 3. Browser language
    if (forceLang) {
      targetLang = forceLang;
    } else {
      try {
        targetLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        // Check if the saved preference is older than 30 days
        const timestamp = localStorage.getItem(LANGUAGE_TIMESTAMP_KEY);
        const isExpired = timestamp && (Date.now() - parseInt(timestamp)) > 30 * 24 * 60 * 60 * 1000;
        
        if (isExpired) {
          targetLang = null;
          languagePreference.clearPreference();
        }
      } catch (error) {
        console.warn('Error accessing language preference from storage', error);
      }
    }
    
    // If no saved preference, use browser language
    if (!targetLang) {
      const browserLang = navigator.language.split('-')[0];
      const isSupported = languages.some(lang => lang.code === browserLang && lang.enabled);
      targetLang = isSupported ? browserLang : 'en';
      setIsFallbackLanguage(!isSupported);
    }
    
    // Apply the language
    try {
      await i18n.changeLanguage(targetLang);
    } catch (error) {
      console.error('Failed to set initial language', error);
      // Fallback to English
      if (targetLang !== 'en') {
        await i18n.changeLanguage('en');
        setIsFallbackLanguage(true);
      }
    }
  }, [languages, languagePreference, i18n]);
  
  // Enhanced change language function with loading state, animation, and error handling
  const changeLanguage = useCallback(async (lang: string) => {
    if (lang === currentLanguage || isChangingLanguage) return Promise.resolve();
    
    // Store previous language for potential rollback
    previousLanguage.current = currentLanguage;
    
    // Show loading state
    setIsChangingLanguage(true);
    
    // Clear any existing timeout
    if (changingTimeout.current) {
      clearTimeout(changingTimeout.current);
    }
    
    // Use a timeout to ensure the UI shows loading state
    return new Promise<void>((resolve, reject) => {
      changingTimeout.current = setTimeout(async () => {
        try {
          // Change the language
          await i18n.changeLanguage(lang);
          
          // Save preference
          languagePreference.savePreference(lang);
          
          // Success notification (subtle)
          const langInfo = languages.find(l => l.code === lang);
          if (langInfo) {
            toast({
              title: `Language changed to ${langInfo.name}`,
              description: `${langInfo.flag} The application now displays in ${langInfo.nativeName}`,
              duration: 3000,
            });
          }
          
          resolve();
        } catch (error) {
          console.error('Failed to change language', error);
          
          // Rollback to previous language
          if (previousLanguage.current) {
            try {
              await i18n.changeLanguage(previousLanguage.current);
            } catch (innerError) {
              console.error('Failed to rollback language change', innerError);
            }
          }
          
          // Error notification
          toast({
            title: "Language change failed",
            description: "Could not load the selected language. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          
          reject(error);
        } finally {
          // Delay hiding loading indicator for a smoother experience
          setTimeout(() => {
            setIsChangingLanguage(false);
            changingTimeout.current = null;
          }, 300);
        }
      }, 400); // Slight delay for better UX
    });
  }, [currentLanguage, isChangingLanguage, i18n, languagePreference, languages]);

  // Update current language and direction when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
      
      // Update html lang attribute
      document.documentElement.setAttribute('lang', i18n.language);
      
      // Set text direction for RTL languages
      const isRtl = rtlLanguages.includes(i18n.language);
      
      setDirection(isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      
      // Add/remove RTL class to body for global styling
      if (isRtl) {
        document.body.classList.add('rtl');
        document.body.classList.add('dir-transition');
      } else {
        document.body.classList.remove('rtl');
        document.body.classList.add('dir-transition');
      }
      
      // Add animation class temporarily
      document.body.classList.add('rtl-switch-enter');
      setTimeout(() => {
        document.body.classList.remove('rtl-switch-enter');
      }, 500);
    };

    // Set initial language
    handleLanguageChanged();

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, rtlLanguages]);

  // Initialize language on first load
  useEffect(() => {
    setInitialLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    languages: languages.filter(lang => lang.enabled),
    isChangingLanguage,
    direction,
    isRTL: direction === 'rtl',
    languagePreference,
    setInitialLanguage,
    isFallbackLanguage
  }), [
    currentLanguage, 
    changeLanguage, 
    languages, 
    isChangingLanguage, 
    direction, 
    languagePreference, 
    setInitialLanguage,
    isFallbackLanguage
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
