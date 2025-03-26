
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
  };

  // Get current language display name
  const currentLangName = languages.find(lang => lang.code === currentLanguage)?.name || 'English';

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className} aria-label={t('language.selectLanguage')}>
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={currentLanguage === lang.code ? "bg-muted" : ""}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
          <Globe className="h-4 w-4" />
          <span>{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="py-2 px-3 text-xs font-medium text-muted-foreground border-b">
          {t('language.selectLanguage')}
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
