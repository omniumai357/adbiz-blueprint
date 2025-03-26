
import { useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to enhance screen reader support for multi-language content
 * 
 * Improves accessibility by:
 * - Setting appropriate language attributes on HTML elements
 * - Managing RTL text direction
 * - Announcing language changes to screen readers
 * - Managing language-specific CSS classes
 */
export function useLanguageA11y() {
  const { currentLanguage, direction, isChangingLanguage } = useLanguage();
  
  // Create an announcer element for screen readers
  const createOrGetAnnouncer = useCallback(() => {
    const id = 'language-change-announcer';
    let announcer = document.getElementById(id);
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = id;
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    return announcer;
  }, []);
  
  // Announce a message to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcer = createOrGetAnnouncer();
    
    // Clear previous announcement
    announcer.textContent = '';
    
    // Use setTimeout to ensure screen readers recognize the change
    setTimeout(() => {
      announcer.textContent = message;
      
      // Clear after it's been read
      setTimeout(() => {
        announcer.textContent = '';
      }, 3000);
    }, 100);
  }, [createOrGetAnnouncer]);
  
  // Update accessibility attributes when language changes
  useEffect(() => {
    if (isChangingLanguage) {
      document.documentElement.classList.add('changing-language');
      return;
    }
    
    // Remove loading class
    document.documentElement.classList.remove('changing-language');
    
    // Update lang attribute on the document element
    document.documentElement.setAttribute('lang', currentLanguage);
    
    // Update direction attribute
    document.documentElement.setAttribute('dir', direction);
    
    // Update RTL classes on body
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Announce language change to screen readers
    const languageNames: Record<string, string> = {
      en: 'English',
      es: 'Spanish (Español)',
      fr: 'French (Français)',
      ar: 'Arabic (العربية)',
      he: 'Hebrew (עִברִית)'
    };
    
    const languageName = languageNames[currentLanguage] || currentLanguage;
    announceToScreenReader(`Language changed to ${languageName}. Page direction is ${direction === 'rtl' ? 'right to left' : 'left to right'}.`);
    
    // Add language-specific attributes to key content areas
    document.querySelectorAll('[data-i18n-section]').forEach(element => {
      element.setAttribute('lang', currentLanguage);
      
      if (direction === 'rtl') {
        element.setAttribute('dir', 'rtl');
      } else {
        element.removeAttribute('dir');
      }
    });
    
  }, [currentLanguage, direction, isChangingLanguage, announceToScreenReader]);
  
  // Return utility functions for component-level usage
  return {
    applyLanguageAttributes: (element: HTMLElement) => {
      element.setAttribute('lang', currentLanguage);
      if (direction === 'rtl') {
        element.setAttribute('dir', 'rtl');
      } else {
        element.removeAttribute('dir');
      }
    },
    
    announceLanguageChange: (message: string) => {
      announceToScreenReader(message);
    }
  };
}
