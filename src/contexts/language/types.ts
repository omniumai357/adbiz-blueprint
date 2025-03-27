
// Types for language context
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction?: string;
  flag?: string;
  enabled?: boolean;
}

export interface LanguagePreference {
  savePreference: (lang: string) => void;
  clearPreference: () => void;
  hasPreference: boolean;
}

export interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  languages: Language[];
  isChangingLanguage: boolean;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  languagePreference: LanguagePreference;
  setInitialLanguage: (langCode?: string) => Promise<void>;
  isFallbackLanguage: boolean;
}

// Storage keys
export const LANGUAGE_STORAGE_KEY = 'userLanguagePreference';
export const LANGUAGE_TIMESTAMP_KEY = 'userLanguageTimestamp';

// Preference expiration (30 days in milliseconds)
export const PREFERENCE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;
