
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { cn } from '@/lib/utils';

interface FooterLanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
}

export const FooterLanguageSelector: React.FC<FooterLanguageSelectorProps> = ({
  className,
  showNativeNames = true
}) => {
  const { t } = useTranslation('language');
  
  return (
    <div className={cn("mt-4", className)}>
      <LanguageSelector 
        variant="footer" 
        showNativeNames={showNativeNames} 
        align="start"
        side="top"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {t('langSupportNotice', 'This site is available in multiple languages. Choose your preferred language above.')}
      </p>
    </div>
  );
};

export default FooterLanguageSelector;
