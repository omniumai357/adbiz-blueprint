
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files for initial load
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enRewards from './locales/en/rewards.json';
import enLanguage from './locales/en/language.json';
import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esRewards from './locales/es/rewards.json';
import esLanguage from './locales/es/language.json';
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frRewards from './locales/fr/rewards.json';
import frLanguage from './locales/fr/language.json';

// Namespace configuration
export const defaultNS = 'common';
export const namespaces = ['common', 'auth', 'rewards', 'language', 'tour'];

// Configure i18next
i18n
  // Use HTTP backend for dynamic loading (for future use)
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
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        rewards: enRewards,
        language: enLanguage
      },
      es: {
        common: esCommon,
        auth: esAuth,
        rewards: esRewards,
        language: esLanguage
      },
      fr: {
        common: frCommon,
        auth: frAuth,
        rewards: frRewards,
        language: frLanguage
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
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
