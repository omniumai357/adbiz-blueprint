
import React from 'react';
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
import { useLanguageSelector, LanguageSelectorProps } from '../hooks/useLanguageSelector';

export const DefaultLanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  showNativeNames = false,
  showFlags = true,
  align = 'end',
  side = 'bottom'
}) => {
  const {
    currentLanguage,
    languages,
    isChangingLanguage,
    direction,
    handleLanguageChange,
    getCurrentLanguage,
    getLanguageDisplayName,
    showFlags: shouldShowFlags,
    ariaLabels
  } = useLanguageSelector({ showNativeNames, showFlags });

  // Get current language display info
  const currentLangInfo = getCurrentLanguage();
  const currentLangName = getLanguageDisplayName(currentLangInfo);

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
          {shouldShowFlags && <span className="locale-flag">{currentLangInfo.flag}</span>}
          <span>{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        side={side} 
        aria-label={ariaLabels.dropdown}
        className="language-switch-enter"
      >
        <DropdownMenuLabel>{ariaLabels.button}</DropdownMenuLabel>
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
            {shouldShowFlags && <span className="locale-flag">{lang.flag}</span>}
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
