
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemePreset } from '@/lib/tour/types/theme';

interface ThemeSelectorProps {
  availableThemes: ThemePreset[];
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  onReset: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
  isTransitioning?: boolean;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  availableThemes,
  currentTheme,
  onThemeChange,
  onReset,
  isMobile,
  isTablet,
  isTransitioning,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-2" : 
        isTablet ? "grid-cols-3" : 
        "grid-cols-4"
      )}>
        {availableThemes.map(theme => (
          <Button
            key={theme.id}
            variant={currentTheme === theme.id ? "default" : "outline"}
            size={isMobile ? "sm" : "default"}
            onClick={() => onThemeChange(theme.id)}
            className={cn(
              "min-w-24 justify-start px-3",
              isMobile && "text-xs",
              isTransitioning && "opacity-50 pointer-events-none"
            )}
            disabled={isTransitioning}
          >
            <span 
              className="w-3 h-3 rounded-full mr-2"
              style={{ 
                backgroundColor: theme.colors.accentBlue || 'currentColor',
                boxShadow: theme.id === currentTheme 
                  ? '0 0 0 2px rgba(255,255,255,0.8)' 
                  : 'none'
              }}
            />
            {theme.name}
          </Button>
        ))}
      </div>
      
      {availableThemes.find(t => t.id === currentTheme)?.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {availableThemes.find(t => t.id === currentTheme)?.description}
        </p>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="mt-4"
        disabled={isTransitioning || currentTheme === 'default'}
      >
        Reset to Default
      </Button>
    </div>
  );
};
