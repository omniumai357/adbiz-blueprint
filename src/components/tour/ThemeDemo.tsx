
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';
import { cn } from '@/lib/utils';

interface ThemeDemoProps {
  className?: string;
}

export const ThemeDemo: React.FC<ThemeDemoProps> = ({ className }) => {
  const { currentTheme, setTheme, resetTheme, setCustomThemeColors } = useTourTheme();
  
  const themes = [
    { id: 'default', name: 'Default' },
    { id: 'blue', name: 'Blue' },
    { id: 'purple', name: 'Purple' },
    { id: 'green', name: 'Green' },
    { id: 'amber', name: 'Amber' }
  ];
  
  const handleCustomTheme = () => {
    setCustomThemeColors({
      'accent-blue': '#FF5733',
      'button-primary-bg': '#FF5733',
      'button-primary-hover-bg': '#E04020',
      'progress-fill': '#FF5733',
      'border-highlight': '#FF5733',
      'spotlight-glow': 'rgba(255, 87, 51, 0.6)'
    });
  };
  
  return (
    <div className={cn("p-6 space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Tour Theme Previewer</h2>
        <p className="text-sm text-muted-foreground">
          Test different tour themes to see how they affect the tour appearance.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {themes.map(theme => (
          <Button
            key={theme.id}
            variant={currentTheme === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(theme.id as any)}
            className="min-w-24"
          >
            {theme.name}
          </Button>
        ))}
        
        <Button
          variant={currentTheme === 'custom' ? "default" : "outline"}
          size="sm"
          onClick={handleCustomTheme}
          className="min-w-24"
        >
          Custom
        </Button>
      </div>
      
      <div className="space-y-4 border rounded-md p-4 bg-[color:var(--tour-tooltip-bg)] text-[color:var(--tour-tooltip-text)]">
        <h3 className="font-medium">Tour Component Preview</h3>
        
        <div className="flex flex-col space-y-2">
          <div className="h-2 w-full rounded-full bg-[color:var(--tour-progress-bg)]">
            <div 
              className="h-2 rounded-full bg-[color:var(--tour-progress-fill)]" 
              style={{ width: '60%' }}
            />
          </div>
          
          <div className="flex space-x-1 justify-center mt-1">
            {[0, 1, 2, 3, 4].map(idx => (
              <div 
                key={idx}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  idx === 2 
                    ? "bg-[color:var(--tour-accent-blue)] scale-125" 
                    : idx < 2 
                      ? "bg-[color:var(--tour-accent-blue)]/60" 
                      : "bg-[color:var(--tour-progress-bg)]"
                )}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2 h-8 text-[color:var(--tour-text-secondary)] hover:bg-[color:var(--tour-button-secondary-hover-bg)]"
          >
            Previous
          </Button>
          
          <Button 
            size="sm" 
            className="text-xs px-3 h-8 bg-[color:var(--tour-button-primary-bg)] text-[color:var(--tour-button-primary-text)] hover:bg-[color:var(--tour-button-primary-hover-bg)]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
