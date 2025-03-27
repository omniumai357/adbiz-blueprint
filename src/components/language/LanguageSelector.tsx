
import React from 'react';
import MinimalLanguageSelector from './variants/MinimalLanguageSelector';
import ExpandedLanguageSelector from './variants/ExpandedLanguageSelector';
import FooterLanguageSelector from './variants/FooterLanguageSelector';
import DefaultLanguageSelector from './variants/DefaultLanguageSelector';
import { LanguageSelectorProps } from './hooks/useLanguageSelector';

interface LanguageSelectorComponentProps extends LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'expanded' | 'footer';
}

/**
 * Language selector component with different presentation variants
 * 
 * @example
 * // Default dropdown selector
 * <LanguageSelector />
 * 
 * @example
 * // Minimal icon-only selector
 * <LanguageSelector variant="minimal" />
 * 
 * @example
 * // Expanded buttons selector
 * <LanguageSelector variant="expanded" showNativeNames={true} />
 * 
 * @example
 * // Footer simple text links
 * <LanguageSelector variant="footer" />
 */
export const LanguageSelector: React.FC<LanguageSelectorComponentProps> = (props) => {
  const { variant = 'default' } = props;

  // Render the appropriate variant based on the prop
  switch (variant) {
    case 'minimal':
      return <MinimalLanguageSelector {...props} />;
    case 'expanded':
      return <ExpandedLanguageSelector {...props} />;
    case 'footer':
      return <FooterLanguageSelector {...props} />;
    default:
      return <DefaultLanguageSelector {...props} />;
  }
};

export default LanguageSelector;
