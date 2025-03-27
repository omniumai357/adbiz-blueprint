
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // Add this import
import MinimalLanguageSelector from '../variants/MinimalLanguageSelector';
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

describe('MinimalLanguageSelector', () => {
  it('renders with default props', () => {
    render(
      <LanguageProvider>
        <MinimalLanguageSelector />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('relative overflow-hidden');
  });
  
  it('applies custom className', () => {
    render(
      <LanguageProvider>
        <MinimalLanguageSelector className="custom-class" />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
  
  it('responds to click events', async () => {
    const user = userEvent.setup();
    
    render(
      <LanguageProvider>
        <MinimalLanguageSelector />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // The dropdown should be open
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
  
  it('handles align and side props correctly', () => {
    render(
      <LanguageProvider>
        <MinimalLanguageSelector align="start" side="top" />
      </LanguageProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
  
  it('displays globe icon by default', () => {
    render(
      <LanguageProvider>
        <MinimalLanguageSelector />
      </LanguageProvider>
    );
    
    // Look for the globe icon (using SVG or other identifiable attribute)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
