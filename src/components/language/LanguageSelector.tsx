
import React from 'react';
import MinimalLanguageSelector from './variants/MinimalLanguageSelector';
import ExpandedLanguageSelector from './variants/ExpandedLanguageSelector';
import FooterLanguageSelector from './variants/FooterLanguageSelector';
import DefaultLanguageSelector from './variants/DefaultLanguageSelector';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'expanded' | 'footer';
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
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
