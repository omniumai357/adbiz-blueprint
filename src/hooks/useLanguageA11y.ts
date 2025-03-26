
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to enhance screen reader support for multi-language content
 */
export function useLanguageA11y() {
  const { currentLanguage, direction } = useLanguage();
  
  // Update accessibility attributes when language changes
  useEffect(() => {
    // Update lang attribute on the document element
    document.documentElement.setAttribute('lang', currentLanguage);
    
    // Update direction attribute
    document.documentElement.setAttribute('dir', direction);
    
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
      
    // Announce language change
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
    
  }, [currentLanguage, direction]);
}
