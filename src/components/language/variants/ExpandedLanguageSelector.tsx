
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguageSelector, LanguageSelectorProps } from '../hooks/useLanguageSelector';

export const ExpandedLanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  showNativeNames = false,
  showFlags = true
}) => {
  const {
    currentLanguage,
    languages,
    isChangingLanguage,
    handleLanguageChange,
    showFlags: shouldShowFlags,
    ariaLabels
  } = useLanguageSelector({ showNativeNames, showFlags });

  return (
    <div 
      className={cn("flex flex-col space-y-2", className)} 
      role="region" 
      aria-label={ariaLabels.button}
    >
      <label className="text-sm font-medium text-muted-foreground">{ariaLabels.button}</label>
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
            {shouldShowFlags && <span className="locale-flag mr-1">{lang.flag}</span>}
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
