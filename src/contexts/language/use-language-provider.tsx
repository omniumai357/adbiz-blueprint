
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { AVAILABLE_LANGUAGES, RTL_LANGUAGES, LANGUAGE_CHANGE_TIMEOUT, LOADING_HIDE_DELAY } from './constants';
import { createLanguagePreference } from './language-storage';
import { LanguageContextType, Language } from './types';

export function useLanguageProvider(): LanguageContextType {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [isFallbackLanguage, setIsFallbackLanguage] = useState(false);
  const previousLanguage = useRef<string | null>(null);
  const changingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Only include enabled languages
  const languages = useMemo(() => 
    AVAILABLE_LANGUAGES.filter(lang => lang.enabled), 
  []);
  
  // Create language storage helpers
  const languagePreference = useMemo(() => {
    const storage = createLanguagePreference();
    return {
      savePreference: storage.savePreference,
      clearPreference: storage.clearPreference,
      hasPreference: storage.hasPreference()
    };
  }, []);

  // Set initial language based on stored preference or browser setting
  const setInitialLanguage = useCallback(async (forceLang?: string) => {
    const storage = createLanguagePreference();
    let targetLang: string | null = null;
    
    // Priority: 1. Force parameter, 2. Local storage, 3. Browser language
    if (forceLang) {
      targetLang = forceLang;
    } else {
      try {
        targetLang = storage.getPreference();
        
        // Check if the saved preference is expired
        if (storage.isPreferenceExpired()) {
          targetLang = null;
          storage.clearPreference();
        }
      } catch (error) {
        console.warn('Error accessing language preference from storage', error);
      }
    }
    
    // If no saved preference, use browser language
    if (!targetLang) {
      const browserLang = navigator.language.split('-')[0];
      const isSupported = AVAILABLE_LANGUAGES.some(lang => lang.code === browserLang && lang.enabled);
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
  }, [i18n]);
  
  // Change language function with loading state and error handling
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
          const langInfo = AVAILABLE_LANGUAGES.find(l => l.code === lang);
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
          }, LOADING_HIDE_DELAY);
        }
      }, LANGUAGE_CHANGE_TIMEOUT);
    });
  }, [currentLanguage, i18n, isChangingLanguage, languagePreference]);

  // Update current language and direction when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
      
      // Update html lang attribute
      document.documentElement.setAttribute('lang', i18n.language);
      
      // Set text direction for RTL languages
      const isRtl = RTL_LANGUAGES.includes(i18n.language);
      
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
  }, [i18n]);

  // Initialize language on first load
  useEffect(() => {
    setInitialLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized context value to prevent unnecessary renders
  return useMemo(() => ({
    currentLanguage,
    changeLanguage,
    languages,
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
}
