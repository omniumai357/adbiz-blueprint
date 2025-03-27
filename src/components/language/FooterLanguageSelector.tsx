
import React from 'react';
import { FooterLanguageSelector as FooterVariant } from './variants/FooterLanguageSelector';
import { cn } from '@/lib/utils';
import { LanguageSelectorProps } from './hooks/useLanguageSelector';

interface FooterLanguageSelectorWrapperProps extends LanguageSelectorProps {
  className?: string;
}

export const FooterLanguageSelector: React.FC<FooterLanguageSelectorWrapperProps> = ({
  className,
  showNativeNames = true,
  ...rest
}) => {
  return (
    <FooterVariant 
      className={cn("mt-4", className)} 
      showNativeNames={showNativeNames} 
      {...rest} 
    />
  );
};

export default FooterLanguageSelector;
