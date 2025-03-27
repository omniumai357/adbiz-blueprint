
import React from 'react';
import { FooterLanguageSelector as FooterVariant } from './variants/FooterLanguageSelector';
import { cn } from '@/lib/utils';

interface FooterLanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
}

export const FooterLanguageSelector: React.FC<FooterLanguageSelectorProps> = ({
  className,
  showNativeNames = true
}) => {
  return <FooterVariant className={cn("mt-4", className)} showNativeNames={showNativeNames} />;
};

export default FooterLanguageSelector;
