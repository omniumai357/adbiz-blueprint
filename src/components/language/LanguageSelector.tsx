
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Globe, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'expanded' | 'footer';
  className?: string;
  showNativeNames?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  className = '',
  showNativeNames = false,
  align = 'end',
  side = 'bottom'
}) => {
  const { t } = useTranslation('language');
  const { currentLanguage, changeLanguage, languages, isChangingLanguage, direction } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    if (isChangingLanguage) return;
    changeLanguage(langCode);
  };

  // Get current language display name
  const currentLangInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const currentLangName = showNativeNames ? currentLangInfo.nativeName : currentLangInfo.name;

  // ARIA labels for accessibility
  const ariaLabels = {
    button: t('selectLanguage'),
    dropdown: t('availableLanguages', 'Available languages'),
    selected: t('currentLanguage', 'Current language: {{language}}', { language: currentLangName })
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(className, isChangingLanguage && "opacity-70")} 
            aria-label={ariaLabels.button}
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side} aria-label={ariaLabels.dropdown}>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                currentLanguage === lang.code && "bg-muted",
                "flex items-center justify-between",
                direction === 'rtl' && "flex-row-reverse"
              )}
              disabled={isChangingLanguage}
              aria-current={currentLanguage === lang.code ? 'true' : 'false'}
            >
              <span>{showNativeNames ? lang.nativeName : lang.name}</span>
              {currentLanguage === lang.code && <Check className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={cn("flex flex-col space-y-2", className)} role="region" aria-label={ariaLabels.button}>
        <label className="text-sm font-medium text-muted-foreground">{t('selectLanguage')}</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLanguage === lang.code ? "default" : "outline"}
              size="sm"
              className={cn(
                "min-w-[80px]",
                isChangingLanguage && "opacity-70"
              )}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isChangingLanguage || currentLanguage === lang.code}
              aria-pressed={currentLanguage === lang.code}
              lang={lang.code}
            >
              {isChangingLanguage && currentLanguage === lang.code ? (
                <Loader2 className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0 animate-spin" />
              ) : null}
              {showNativeNames ? lang.nativeName : lang.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div 
        className={cn("flex flex-col space-y-2", className)} 
        role="region" 
        aria-label={ariaLabels.button}
      >
        <p className="text-sm font-medium text-muted-foreground mb-1">{t('selectLanguage')}</p>
        <div className="flex flex-wrap gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={cn(
                "text-sm px-2 py-1 rounded hover:underline",
                currentLanguage === lang.code ? "font-medium" : "text-muted-foreground"
              )}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isChangingLanguage}
              aria-pressed={currentLanguage === lang.code}
              lang={lang.code}
            >
              {showNativeNames ? lang.nativeName : lang.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex items-center gap-2", 
            className, 
            isChangingLanguage && "opacity-80",
            direction === 'rtl' && "flex-row-reverse"
          )}
          disabled={isChangingLanguage}
          aria-label={ariaLabels.button}
        >
          {isChangingLanguage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} aria-label={ariaLabels.dropdown}>
        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              currentLanguage === lang.code && "bg-muted",
              "flex items-center justify-between gap-4",
              direction === 'rtl' && "flex-row-reverse"
            )}
            disabled={isChangingLanguage}
            lang={lang.code}
            aria-current={currentLanguage === lang.code ? 'true' : 'false'}
          >
            <span>
              {showNativeNames ? (
                <>{lang.nativeName} <span className="text-xs text-muted-foreground">({lang.name})</span></>
              ) : (
                lang.name
              )}
            </span>
            {currentLanguage === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
