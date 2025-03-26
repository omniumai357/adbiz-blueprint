
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemePreset } from '@/lib/tour/types/theme';
import { cn } from '@/lib/utils';

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
        "grid gap-4",
        isMobile ? "grid-cols-2" : 
        isTablet ? "grid-cols-3" : 
        "grid-cols-4"
      )}>
        {availableThemes.map(theme => (
          <Card 
            key={theme.id}
            className={cn(
              "cursor-pointer hover:bg-accent/5 transition-colors", 
              currentTheme === theme.id && "ring-2 ring-primary"
            )}
            onClick={() => onThemeChange(theme.id)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-center h-16 bg-muted rounded-md">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ 
                      backgroundColor: theme.colors.primary || theme.colors.accentBlue || '#3b82f6' 
                    }}
                  />
                </div>
                <div className="text-sm font-medium text-center">
                  {theme.name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isTransitioning || currentTheme === "default"}
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
