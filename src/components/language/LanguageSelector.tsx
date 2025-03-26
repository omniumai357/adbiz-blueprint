
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
  const { currentLanguage, changeLanguage, languages, isChangingLanguage } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    if (isChangingLanguage) return;
    changeLanguage(langCode);
  };

  // Get current language display name
  const currentLangInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const currentLangName = showNativeNames ? currentLangInfo.nativeName : currentLangInfo.name;

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(className, isChangingLanguage && "opacity-70")} 
            aria-label={t('selectLanguage')}
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side}>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                currentLanguage === lang.code && "bg-muted",
                "flex items-center justify-between"
              )}
              disabled={isChangingLanguage}
            >
              <span>{showNativeNames ? lang.nativeName : lang.name}</span>
              {currentLanguage === lang.code && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
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
            >
              {isChangingLanguage && currentLanguage === lang.code ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
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
      <div className={cn("flex flex-col space-y-2", className)}>
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
          className={cn("flex items-center gap-2", className, isChangingLanguage && "opacity-80")}
          disabled={isChangingLanguage}
        >
          {isChangingLanguage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              currentLanguage === lang.code && "bg-muted",
              "flex items-center justify-between gap-4"
            )}
            disabled={isChangingLanguage}
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
