
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpandedLanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
}

export const ExpandedLanguageSelector: React.FC<ExpandedLanguageSelectorProps> = ({ 
  className = '',
  showNativeNames = false,
  showFlags = true
}) => {
  const { t } = useTranslation('language');
  const { 
    currentLanguage, 
    changeLanguage, 
    languages, 
    isChangingLanguage 
  } = useLanguage();

  const handleLanguageChange = async (langCode: string) => {
    if (isChangingLanguage || langCode === currentLanguage) return;
    await changeLanguage(langCode);
  };

  return (
    <div 
      className={cn("flex flex-col space-y-2", className)} 
      role="region" 
      aria-label={t('selectLanguage')}
    >
      <label className="text-sm font-medium text-muted-foreground">{t('selectLanguage')}</label>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "outline"}
            size="sm"
            className={cn(
              "min-w-[80px]",
              isChangingLanguage && currentLanguage === lang.code && "language-loading",
              "language-option"
            )}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isChangingLanguage || currentLanguage === lang.code}
            aria-pressed={currentLanguage === lang.code}
            lang={lang.code}
          >
            {showFlags && <span className="locale-flag mr-1">{lang.flag}</span>}
            <span className={currentLanguage === lang.code ? "language-selected" : ""}>
              {showNativeNames ? lang.nativeName : lang.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExpandedLanguageSelector;
