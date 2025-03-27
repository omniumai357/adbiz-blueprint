
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface FooterVariantProps {
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
}

export const FooterLanguageSelector: React.FC<FooterVariantProps> = ({ 
  className = '',
  showNativeNames = true,
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
      <p className="text-sm font-medium text-muted-foreground mb-1">{t('selectLanguage')}</p>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={cn(
              "text-sm px-3 py-1 rounded hover:underline flex items-center gap-1",
              currentLanguage === lang.code ? "font-medium" : "text-muted-foreground",
              isChangingLanguage && currentLanguage === lang.code && "language-loading",
              "language-option"
            )}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isChangingLanguage}
            aria-pressed={currentLanguage === lang.code}
            lang={lang.code}
          >
            {showFlags && <span className="locale-flag">{lang.flag}</span>}
            <span className={currentLanguage === lang.code ? "language-selected" : ""}>
              {showNativeNames ? lang.nativeName : lang.name}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {t('langSupportNotice', 'This site is available in multiple languages. Choose your preferred language above.')}
      </p>
    </div>
  );
};

export default FooterLanguageSelector;
