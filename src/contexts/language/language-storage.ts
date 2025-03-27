
import { LANGUAGE_STORAGE_KEY, LANGUAGE_TIMESTAMP_KEY, PREFERENCE_EXPIRATION } from './types';

// Utility for language preference storage
export const createLanguagePreference = () => ({
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
  
  hasPreference: () => {
    try {
      return Boolean(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    } catch (error) {
      console.warn('Failed to check language preference', error);
      return false;
    }
  },
  
  isPreferenceExpired: () => {
    try {
      const timestamp = localStorage.getItem(LANGUAGE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      
      return (Date.now() - parseInt(timestamp)) > PREFERENCE_EXPIRATION;
    } catch (error) {
      console.warn('Failed to check language preference expiration', error);
      return true;
    }
  },
  
  getPreference: () => {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to get language preference', error);
      return null;
    }
  }
});

export type LanguageStorage = ReturnType<typeof createLanguagePreference>;
