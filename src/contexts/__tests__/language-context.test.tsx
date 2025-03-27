import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LanguageProvider, useLanguage } from '../language-context';

// Mock i18n with mocked functions
jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    changeLanguage: jest.fn().mockResolvedValue(undefined),
    language: 'en',
    on: jest.fn(),
    off: jest.fn(),
  }
}));

// Get the mocked i18n instance
const mockedI18n = (i18n as unknown) as {
  changeLanguage: jest.Mock;
  language: string;
  on: jest.Mock;
  off: jest.Mock;
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Test component that consumes the language context
const TestComponent = () => {
  const { 
    currentLanguage, 
    changeLanguage, 
    languages,
    isChangingLanguage,
    direction,
    isRTL
  } = useLanguage();
  
  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="direction">{direction}</div>
      <div data-testid="is-rtl">{isRTL ? 'true' : 'false'}</div>
      <div data-testid="is-changing">{isChangingLanguage ? 'true' : 'false'}</div>
      <div data-testid="languages-count">{languages.length}</div>
      <button 
        data-testid="change-to-fr" 
        onClick={() => changeLanguage('fr')}
      >
        Change to French
      </button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });
  
  it('provides default language values', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('is-rtl')).toHaveTextContent('false');
    expect(screen.getByTestId('is-changing')).toHaveTextContent('false');
    expect(screen.getByTestId('languages-count')).toHaveTextContent(/^3$/); // Enabled languages only
  });
  
  it('changes language when requested', async () => {
    const user = userEvent.setup();
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Simulate language change
    await user.click(screen.getByTestId('change-to-fr'));
    
    // Should show loading state
    expect(screen.getByTestId('is-changing')).toHaveTextContent('true');
    
    // Should call i18n's changeLanguage
    expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('fr');
    
    // Mock the language change completion
    await act(async () => {
      // Simulate i18n language changed event
      const changeHandler = mockedI18n.on.mock.calls.find(call => call[0] === 'languageChanged')?.[1];
      if (changeHandler) {
        mockedI18n.language = 'fr';
        changeHandler();
      }
      
      // Wait for the loading state to finish
      await new Promise(resolve => setTimeout(resolve, 700)); // To account for the timeout in the code
    });
    
    // Should update localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'userLanguagePreference', 
      'fr'
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('is-changing')).toHaveTextContent('false');
    });
  });
  
  it('reads language preference from localStorage on init', () => {
    // Set a language preference
    localStorageMock.setItem('userLanguagePreference', 'es');
    localStorageMock.setItem('userLanguageTimestamp', Date.now().toString());
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Should attempt to load the saved preference
    expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('es');
  });
  
  it('handles RTL languages correctly', async () => {
    // Mock a scenario where an RTL language is set
    mockedI18n.language = 'ar'; // Arabic is RTL
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Trigger the language changed handler
    await act(async () => {
      const changeHandler = mockedI18n.on.mock.calls.find(call => call[0] === 'languageChanged')?.[1];
      if (changeHandler) {
        changeHandler();
      }
    });
    
    // Direction should be 'rtl'
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    expect(screen.getByTestId('is-rtl')).toHaveTextContent('true');
    
    // HTML attributes should be set
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.body.classList.contains('rtl')).toBe(true);
  });
});
