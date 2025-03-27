
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Globe, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalLanguageSelectorProps {
  className?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const MinimalLanguageSelector: React.FC<MinimalLanguageSelectorProps> = ({ 
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

  const ariaLabels = {
    button: t('selectLanguage'),
    dropdown: t('availableLanguages', 'Available languages')
  };

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
};

export default MinimalLanguageSelector;
