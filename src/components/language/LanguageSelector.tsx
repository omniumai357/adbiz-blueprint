
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
  showFlags?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  className = '',
  showNativeNames = false,
  showFlags = true,
  align = 'end',
  side = 'bottom'
}) => {
  const { t } = useTranslation('language');
  const { 
    currentLanguage, 
    changeLanguage, 
    languages, 
    isChangingLanguage, 
    direction 
  } = useLanguage();

  const handleLanguageChange = async (langCode: string) => {
    if (isChangingLanguage || langCode === currentLanguage) return;
    await changeLanguage(langCode);
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
            className={cn(
              className, 
              isChangingLanguage && "opacity-70",
              "relative overflow-hidden"
            )} 
            aria-label={ariaLabels.button}
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="sr-only">{t('selectLanguage')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={align} 
          side={side} 
          aria-label={ariaLabels.dropdown}
          className="language-switch-enter"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center gap-2",
                currentLanguage === lang.code && "bg-muted",
                direction === 'rtl' && "flex-row-reverse",
                "language-option"
              )}
              disabled={isChangingLanguage}
              aria-current={currentLanguage === lang.code ? 'true' : 'false'}
            >
              {showFlags && <span className="locale-flag">{lang.flag}</span>}
              <span className={cn(
                currentLanguage === lang.code && "language-selected",
                "relative"
              )}>
                {showNativeNames ? lang.nativeName : lang.name}
              </span>
              {currentLanguage === lang.code && 
                <Check className="h-4 w-4 ml-auto text-primary" />
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'expanded') {
    return (
      <div 
        className={cn("flex flex-col space-y-2", className)} 
        role="region" 
        aria-label={ariaLabels.button}
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
  }

  if (variant === 'footer') {
    return (
      <div 
        className={cn("flex flex-col space-y-2", className)} 
        role="region" 
        aria-label={ariaLabels.button}
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
            isChangingLanguage && "language-loading",
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
          {showFlags && <span className="locale-flag">{currentLangInfo.flag}</span>}
          <span>{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        side={side} 
        aria-label={ariaLabels.dropdown}
        className="language-switch-enter"
      >
        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center gap-2",
              currentLanguage === lang.code && "bg-muted",
              direction === 'rtl' && "flex-row-reverse",
              "language-option"
            )}
            disabled={isChangingLanguage}
            lang={lang.code}
            aria-current={currentLanguage === lang.code ? 'true' : 'false'}
          >
            {showFlags && <span className="locale-flag">{lang.flag}</span>}
            <span className={cn(
              "relative",
              currentLanguage === lang.code && "language-selected"
            )}>
              {showNativeNames ? (
                <>{lang.nativeName} <span className="text-xs text-muted-foreground">({lang.name})</span></>
              ) : (
                lang.name
              )}
            </span>
            {currentLanguage === lang.code && 
              <Check className="h-4 w-4 ml-auto text-primary" />
            }
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
