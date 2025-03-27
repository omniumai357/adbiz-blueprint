
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLanguageSelector } from '../../hooks/useLanguageSelector';
import { LanguageProvider } from '@/contexts/language-context';
import React from 'react';

// Mock the react-i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

// Mock the language context
jest.mock('@/contexts/language-context', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    changeLanguage: jest.fn().mockResolvedValue(undefined),
    languages: [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
    ],
    isChangingLanguage: false,
    direction: 'ltr',
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('useLanguageSelector', () => {
  it('should return the expected values with default props', () => {
    const { result } = renderHook(() => useLanguageSelector({}));
    
    expect(result.current.currentLanguage).toBe('en');
    expect(result.current.languages.length).toBe(3);
    expect(result.current.isChangingLanguage).toBe(false);
    expect(result.current.direction).toBe('ltr');
    expect(result.current.isRTL).toBe(false);
    expect(result.current.showFlags).toBe(true);
    expect(result.current.showNativeNames).toBe(false);
    expect(typeof result.current.handleLanguageChange).toBe('function');
    expect(typeof result.current.getCurrentLanguage).toBe('function');
    expect(typeof result.current.getLanguageDisplayName).toBe('function');
  });
  
  it('should respect custom props', () => {
    const { result } = renderHook(() => 
      useLanguageSelector({ 
        showNativeNames: true, 
        showFlags: false 
      })
    );
    
    expect(result.current.showFlags).toBe(false);
    expect(result.current.showNativeNames).toBe(true);
  });
  
  it('getCurrentLanguage should return the current language object', () => {
    const { result } = renderHook(() => useLanguageSelector({}));
    
    const currentLang = result.current.getCurrentLanguage();
    expect(currentLang).toEqual({
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    });
  });
  
  it('getLanguageDisplayName should return name or nativeName based on showNativeNames prop', () => {
    const { result: resultWithoutNativeNames } = renderHook(() => 
      useLanguageSelector({ showNativeNames: false })
    );
    
    const { result: resultWithNativeNames } = renderHook(() => 
      useLanguageSelector({ showNativeNames: true })
    );
    
    const lang = { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' };
    
    expect(resultWithoutNativeNames.current.getLanguageDisplayName(lang)).toBe('Spanish');
    expect(resultWithNativeNames.current.getLanguageDisplayName(lang)).toBe('Español');
  });
  
  it('ariaLabels should contain the expected accessibility labels', () => {
    const { result } = renderHook(() => useLanguageSelector({}));
    
    expect(result.current.ariaLabels.button).toBe('selectLanguage');
    expect(result.current.ariaLabels.dropdown).toBe('Available languages');
    expect(result.current.ariaLabels.selected).toContain('Current language');
  });
});
