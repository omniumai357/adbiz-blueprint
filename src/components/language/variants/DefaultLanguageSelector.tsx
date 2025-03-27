
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefaultLanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const DefaultLanguageSelector: React.FC<DefaultLanguageSelectorProps> = ({ 
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

export default DefaultLanguageSelector;
