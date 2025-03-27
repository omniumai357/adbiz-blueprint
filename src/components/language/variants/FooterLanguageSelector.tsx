
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguageSelector, LanguageSelectorProps } from '../hooks/useLanguageSelector';

export const FooterLanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  showNativeNames = true,
  showFlags = true
}) => {
  const {
    currentLanguage,
    languages,
    isChangingLanguage,
    handleLanguageChange,
    showFlags: shouldShowFlags,
    ariaLabels,
    t
  } = useLanguageSelector({ showNativeNames, showFlags });

  return (
    <div 
      className={cn("flex flex-col space-y-2", className)} 
      role="region" 
      aria-label={ariaLabels.button}
    >
      <p className="text-sm font-medium text-muted-foreground mb-1">{ariaLabels.button}</p>
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
            {shouldShowFlags && <span className="locale-flag">{lang.flag}</span>}
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
