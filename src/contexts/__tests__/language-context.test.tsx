
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageProvider, useLanguage } from '../language-context';

// Mock i18n
jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    changeLanguage: jest.fn().mockResolvedValue(undefined),
    language: 'en',
    on: jest.fn(),
    off: jest.fn(),
    t: jest.fn((key) => key),
  }
}));

// Test component that uses the language context
const TestComponent = () => {
  const { currentLanguage, changeLanguage, languages, isChangingLanguage } = useLanguage();
  
  return (
    <div>
      <div data-testid="current-lang">{currentLanguage}</div>
      <div data-testid="is-changing">{isChangingLanguage ? 'true' : 'false'}</div>
      <button data-testid="change-to-es" onClick={() => changeLanguage('es')}>
        Change to Spanish
      </button>
      <button data-testid="change-to-fr" onClick={() => changeLanguage('fr')}>
        Change to French
      </button>
      <div data-testid="languages">
        {languages.map((lang) => (
          <span key={lang.code} data-testid={`lang-${lang.code}`}>
            {lang.code}
          </span>
        ))}
      </div>
    </div>
  );
};

describe('LanguageContext', () => {
  it('provides the default language and functions', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('is-changing')).toHaveTextContent('false');
    expect(screen.getByTestId('lang-en')).toHaveTextContent('en');
    expect(screen.getByTestId('lang-es')).toHaveTextContent('es');
    expect(screen.getByTestId('lang-fr')).toHaveTextContent('fr');
  });
  
  it('changes language when changeLanguage is called', async () => {
    const i18n = require('../../i18n').default;
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Act - Click button to change language
    fireEvent.click(screen.getByTestId('change-to-es'));
    
    // Assert - Should show loading state
    expect(screen.getByTestId('is-changing')).toHaveTextContent('true');
    
    // Assert - Should call i18n.changeLanguage
    expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
    
    // Wait for the language change to complete
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
      expect(screen.getByTestId('is-changing')).toHaveTextContent('false');
    });
  });
  
  it('supports multiple language changes', async () => {
    const i18n = require('../../i18n').default;
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Change to Spanish
    fireEvent.click(screen.getByTestId('change-to-es'));
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });
    
    // Change to French
    fireEvent.click(screen.getByTestId('change-to-fr'));
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('fr');
    });
    
    // Verify i18n was called correctly
    expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
  });
});
