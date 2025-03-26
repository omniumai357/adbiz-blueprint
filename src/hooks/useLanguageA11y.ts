
import { useEffect } from 'react';
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
  const { currentLanguage, direction } = useLanguage();
  
  // Update accessibility attributes when language changes
  useEffect(() => {
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
    const announcer = document.getElementById('language-change-announcer') || 
      (() => {
        const div = document.createElement('div');
        div.id = 'language-change-announcer';
        div.setAttribute('role', 'status');
        div.setAttribute('aria-live', 'polite');
        div.className = 'sr-only';
        document.body.appendChild(div);
        return div;
      })();
      
    // Announce language change with culturally appropriate names
    const languageNames = {
      en: 'English',
      es: 'Spanish (Español)',
      fr: 'French (Français)'
    } as const;
    
    const languageName = languageNames[currentLanguage as keyof typeof languageNames] || currentLanguage;
    announcer.textContent = `Language changed to ${languageName}`;
    
    // Clear announcement after it's been read
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
    
    // Add language-specific attributes to key content areas
    document.querySelectorAll('[data-i18n-section]').forEach(element => {
      element.setAttribute('lang', currentLanguage);
    });
    
  }, [currentLanguage, direction]);
  
  // Return utility functions for component-level usage
  return {
    applyLanguageAttributes: (element: HTMLElement) => {
      element.setAttribute('lang', currentLanguage);
      if (direction === 'rtl') {
        element.setAttribute('dir', 'rtl');
      } else {
        element.removeAttribute('dir');
      }
    }
  };
}
