
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';
import { cn } from '@/lib/utils';
import { TourThemeColors } from '@/lib/tour/types/theme';

interface ThemeDemoProps {
  className?: string;
}

export const ThemeDemo: React.FC<ThemeDemoProps> = ({ className }) => {
  const { 
    currentTheme, 
    availableThemes,
    setTheme, 
    resetTheme, 
    setCustomThemeColors,
    isTransitioning
  } = useTourTheme();
  
  const [customColors, setCustomColors] = useState<TourThemeColors>({
    accentBlue: '#FF5733',
    borderHighlight: '#FF5733',
    buttonPrimaryBg: '#FF5733',
    buttonPrimaryHoverBg: '#E04020',
    progressFill: '#FF5733',
    spotlightGlow: 'rgba(255, 87, 51, 0.6)'
  });
  
  const [transitionDuration, setTransitionDuration] = useState<number>(300);
  
  const handleCustomTheme = () => {
    setCustomThemeColors(customColors, 'Custom Theme', {
      duration: transitionDuration
    });
  };
  
  const handleColorChange = (key: keyof TourThemeColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any, { duration: transitionDuration });
  };
  
  return (
    <div className={cn("p-6 space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Tour Theme Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure and preview different tour themes to match your application style.
        </p>
      </div>
      
      <Tabs defaultValue="themes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes">Preset Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Theme</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {availableThemes.map(theme => (
              <Button
                key={theme.id}
                variant={currentTheme === theme.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange(theme.id)}
                className={cn(
                  "min-w-24 justify-start px-3",
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
            onClick={resetTheme}
            className="mt-4"
            disabled={isTransitioning || currentTheme === 'default'}
          >
            Reset to Default
          </Button>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={customColors.accentBlue || '#FF5733'}
                    onChange={(e) => handleColorChange('accentBlue', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={customColors.accentBlue || '#FF5733'}
                    onChange={(e) => handleColorChange('accentBlue', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  type="text"
                  value={customColors.borderRadius || '0.5rem'}
                  onChange={(e) => handleColorChange('borderRadius', e.target.value)}
                  placeholder="0.5rem"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shadowStyle">Shadow Style</Label>
                <Input
                  id="shadowStyle"
                  type="text"
                  value={customColors.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onChange={(e) => handleColorChange('shadow', e.target.value)}
                  placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={customColors.textPrimary || '#1a1f2c'}
                    onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={customColors.textPrimary || '#1a1f2c'}
                    onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={customColors.bgPrimary || '#ffffff'}
                    onChange={(e) => handleColorChange('bgPrimary', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={customColors.bgPrimary || '#ffffff'}
                    onChange={(e) => handleColorChange('bgPrimary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="borderColor"
                    type="color"
                    value={customColors.borderPrimary || '#e5e7eb'}
                    onChange={(e) => handleColorChange('borderPrimary', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={customColors.borderPrimary || '#e5e7eb'}
                    onChange={(e) => handleColorChange('borderPrimary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCustomTheme} 
            className="mt-4"
            disabled={isTransitioning}
          >
            Apply Custom Theme
          </Button>
        </TabsContent>
        
        <TabsContent value="transitions" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="transition-duration" className="block mb-2">
                Transition Duration: {transitionDuration}ms
              </Label>
              <Slider
                id="transition-duration"
                defaultValue={[300]}
                min={0}
                max={1000}
                step={50}
                onValueChange={(values) => setTransitionDuration(values[0])}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Transition Preview</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange('default')}
                  disabled={isTransitioning || currentTheme === 'default'}
                >
                  Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange('blue')}
                  disabled={isTransitioning || currentTheme === 'blue'}
                >
                  Blue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange('purple')}
                  disabled={isTransitioning || currentTheme === 'purple'}
                >
                  Purple
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange('playful')}
                  disabled={isTransitioning || currentTheme === 'playful'}
                >
                  Playful
                </Button>
              </div>
              {isTransitioning && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Transitioning...
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4 border rounded-md p-4 bg-[color:var(--tour-tooltip-bg)] text-[color:var(--tour-tooltip-text)] border-[color:var(--tour-border-primary)]">
        <h3 className="font-medium">Theme Preview</h3>
        
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
            className="text-xs px-3 h-8 bg-[color:var(--tour-button-primary-bg)] text-[color:var(--tour-button-primary-text)] hover:bg-[color:var(--tour-button-primary-hover-bg)] border-[color:var(--tour-border-highlight)]"
          >
            Next
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Implementation Example</h3>
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-xs overflow-auto">
{`// Import the theme hook
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';

// Inside your component
const { setTheme, currentTheme } = useTourTheme();

// Change theme
setTheme('blue');

// Set custom theme
setCustomThemeColors({
  accentBlue: '#FF5733',
  borderRadius: '0.75rem'
});`}
        </pre>
      </div>
    </div>
  );
};
