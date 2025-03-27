
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // This import is critical for the DOM matchers
import { LanguageSelector } from '../LanguageSelector';
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

// Mock components to avoid testing nested components
jest.mock('../variants/DefaultLanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="default-selector">Default Selector</div>
}));

jest.mock('../variants/MinimalLanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="minimal-selector">Minimal Selector</div>
}));

jest.mock('../variants/ExpandedLanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="expanded-selector">Expanded Selector</div>
}));

jest.mock('../variants/FooterLanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="footer-selector">Footer Selector</div>
}));

describe('LanguageSelector', () => {
  it('renders the default variant when no variant prop is provided', () => {
    render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('default-selector')).toBeInTheDocument();
  });
  
  it('renders the minimal variant when minimal is specified', () => {
    render(
      <LanguageProvider>
        <LanguageSelector variant="minimal" />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('minimal-selector')).toBeInTheDocument();
  });
  
  it('renders the expanded variant when expanded is specified', () => {
    render(
      <LanguageProvider>
        <LanguageSelector variant="expanded" />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('expanded-selector')).toBeInTheDocument();
  });
  
  it('renders the footer variant when footer is specified', () => {
    render(
      <LanguageProvider>
        <LanguageSelector variant="footer" />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('footer-selector')).toBeInTheDocument();
  });
  
  it('passes props to the underlying variant component', () => {
    const { rerender } = render(
      <LanguageProvider>
        <LanguageSelector variant="default" className="custom-class" showNativeNames={true} />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('default-selector')).toBeInTheDocument();
    
    // Re-render with different props
    rerender(
      <LanguageProvider>
        <LanguageSelector variant="minimal" align="start" side="top" />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('minimal-selector')).toBeInTheDocument();
  });
});
