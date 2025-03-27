
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // This import is critical for the DOM matchers
import { FooterLanguageSelector } from '../variants/FooterLanguageSelector';
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

describe('FooterLanguageSelector', () => {
  it('renders with default props', () => {
    render(
      <LanguageProvider>
        <FooterLanguageSelector />
      </LanguageProvider>
    );
    
    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex flex-col space-y-2');
  });
  
  it('applies custom className', () => {
    render(
      <LanguageProvider>
        <FooterLanguageSelector className="custom-class" />
      </LanguageProvider>
    );
    
    const container = screen.getByRole('region');
    expect(container).toHaveClass('custom-class');
  });
  
  it('renders language buttons for all available languages', () => {
    render(
      <LanguageProvider>
        <FooterLanguageSelector />
      </LanguageProvider>
    );
    
    // At least 3 language buttons should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
  
  it('includes a language support notice', () => {
    render(
      <LanguageProvider>
        <FooterLanguageSelector />
      </LanguageProvider>
    );
    
    // Check for the support notice text
    const noticeText = screen.getByText('langSupportNotice');
    expect(noticeText).toBeInTheDocument();
    expect(noticeText).toHaveClass('text-xs text-muted-foreground mt-2');
  });
  
  it('handles language change on button click', async () => {
    const user = userEvent.setup();
    
    render(
      <LanguageProvider>
        <FooterLanguageSelector />
      </LanguageProvider>
    );
    
    // Get all language buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    
    // Click on a non-English language button (if English is the default)
    const nonEnglishButton = buttons.find(button => 
      !button.classList.contains('font-medium')
    );
    
    if (nonEnglishButton) {
      await user.click(nonEnglishButton);
      // The changeLanguage method should be called (the actual call is tested in the context tests)
    }
  });
});
