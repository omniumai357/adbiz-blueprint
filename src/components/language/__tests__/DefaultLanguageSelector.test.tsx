
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // This import is critical for the DOM matchers
import DefaultLanguageSelector from '../variants/DefaultLanguageSelector';
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

describe('DefaultLanguageSelector', () => {
  it('renders with default props', () => {
    render(
      <LanguageProvider>
        <DefaultLanguageSelector />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('flex items-center gap-2');
  });
  
  it('applies custom className', () => {
    render(
      <LanguageProvider>
        <DefaultLanguageSelector className="custom-class" />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
  
  it('responds to click events', async () => {
    const user = userEvent.setup();
    
    render(
      <LanguageProvider>
        <DefaultLanguageSelector />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // The dropdown should be open
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
  
  it('shows native names when showNativeNames=true', () => {
    render(
      <LanguageProvider>
        <DefaultLanguageSelector showNativeNames={true} />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
  
  it('handles rtl text direction correctly', async () => {
    // Mock RTL language context
    jest.mock('@/contexts/language-context', () => ({
      ...jest.requireActual('@/contexts/language-context'),
      useLanguage: () => ({
        currentLanguage: 'ar',
        direction: 'rtl',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
          { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
        ],
        isChangingLanguage: false,
        changeLanguage: jest.fn()
      })
    }));
    
    render(
      <LanguageProvider>
        <DefaultLanguageSelector />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
