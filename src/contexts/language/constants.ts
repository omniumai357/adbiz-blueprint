
import { Language } from './types';

// Available languages
export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸', enabled: true },
  { code: 'es', name: 'Español', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', enabled: true },
  { code: 'fr', name: 'Français', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', enabled: true },
  // Future RTL languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦', enabled: false },
  { code: 'he', name: 'Hebrew', nativeName: 'עִברִית', direction: 'rtl', flag: '🇮🇱', enabled: false }
];

// RTL language codes
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Default timeout durations
export const LANGUAGE_CHANGE_TIMEOUT = 400;
export const LOADING_HIDE_DELAY = 300;

// Preference expiration (30 days in milliseconds)
export const PREFERENCE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;
