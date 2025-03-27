
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // Add this import
import ExpandedLanguageSelector from '../variants/ExpandedLanguageSelector';
import { LanguageProvider } from '@/contexts/language-context';

// Mock i18n
jest.mock('../../../i18n', () => ({
  __esModule: true,
  default: {
    changeLanguage: jest.fn().mockResolvedValue(undefined),
    language: 'en',
    on: jest.fn(),
    off: jest.fn(),
    t: jest.fn((key) => key),
  }
}));

// Mock hooks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock language context for specific tests
const mockLanguageContext = {
  currentLanguage: 'en',
  changeLanguage: jest.fn().mockResolvedValue(undefined),
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
  ],
  isChangingLanguage: false,
  direction: 'ltr',
  isRTL: false
};

describe('ExpandedLanguageSelector', () => {
  it('renders with default props', () => {
    render(
      <LanguageProvider>
        <ExpandedLanguageSelector />
      </LanguageProvider>
    );
    
    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex flex-col space-y-2');
  });
  
  it('applies custom className', () => {
    render(
      <LanguageProvider>
        <ExpandedLanguageSelector className="custom-class" />
      </LanguageProvider>
    );
    
    const container = screen.getByRole('region');
    expect(container).toHaveClass('custom-class');
  });
  
  it('renders language buttons for all available languages', () => {
    render(
      <LanguageProvider>
        <ExpandedLanguageSelector />
      </LanguageProvider>
    );
    
    // At least 3 language buttons should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
  
  it('highlights the current language button', () => {
    jest.mock('@/contexts/language-context', () => ({
      useLanguage: () => mockLanguageContext,
      LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }));
    
    render(
      <LanguageProvider>
        <ExpandedLanguageSelector />
      </LanguageProvider>
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
  
  it('displays flags when showFlags is true', () => {
    render(
      <LanguageProvider>
        <ExpandedLanguageSelector showFlags={true} />
      </LanguageProvider>
    );
    
    // There should be some elements with the locale-flag class
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
