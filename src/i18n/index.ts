
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Namespace configuration
export const defaultNS = 'common';
export const namespaces = ['common', 'auth', 'rewards', 'language', 'tour'];

// Configure i18next
i18n
  // Use HTTP backend for dynamic loading
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Set up i18next
  .init({
    // Use separate namespaces for better organization
    ns: namespaces,
    defaultNS,
    
    // Enable dynamic loading of translation files
    backend: {
      // Path where resources get loaded from
      loadPath: '/src/i18n/locales/{{lng}}/{{ns}}.json',
      // Path to post missing keys
      addPath: '/src/i18n/locales/{{lng}}/{{ns}}.missing.json',
    },
    
    // Common options
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Preload these languages
    preload: ['en'],
    
    // Separate load for namespaces
    partialBundledLanguages: true,
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage'],
    },
    
    // React i18next options
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
    }
  });

export default i18n;
