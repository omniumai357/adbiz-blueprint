
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';
import { cn } from '@/lib/utils';
import { TourThemeColors } from '@/lib/tour/types/theme';
import { useDevice } from '@/hooks/use-mobile';

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
    isTransitioning,
    isMobile,
    isTablet
  } = useTourTheme();
  
  const { isPortrait } = useDevice();
  
  const [customColors, setCustomColors] = useState<TourThemeColors>({
    accentBlue: '#FF5733',
    borderHighlight: '#FF5733',
    buttonPrimaryBg: '#FF5733',
    buttonPrimaryHoverBg: '#E04020',
    progressFill: '#FF5733',
    spotlightGlow: 'rgba(255, 87, 51, 0.6)'
  });
  
  const [responsiveColors, setResponsiveColors] = useState<{
    mobile?: Partial<TourThemeColors>;
    tablet?: Partial<TourThemeColors>;
  }>({
    mobile: {
      borderRadius: '0.375rem',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  });
  
  const [transitionDuration, setTransitionDuration] = useState<number>(300);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Update active device based on actual device
  useEffect(() => {
    if (isMobile) setActiveDevice('mobile');
    else if (isTablet) setActiveDevice('tablet');
    else setActiveDevice('desktop');
  }, [isMobile, isTablet]);
  
  const handleCustomTheme = () => {
    setCustomThemeColors(
      customColors, 
      'Custom Theme', 
      { duration: transitionDuration },
      responsiveColors
    );
  };
  
  const handleColorChange = (key: keyof TourThemeColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleResponsiveColorChange = (
    device: 'mobile' | 'tablet',
    key: keyof TourThemeColors, 
    value: string
  ) => {
    setResponsiveColors(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        [key]: value
      }
    }));
  };
  
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any, { duration: transitionDuration });
  };
  
  // Render a more compact UI on mobile
  const renderColorPicker = (
    label: string,
    colorKey: keyof TourThemeColors,
    currentValue: string,
    onChange: (key: keyof TourThemeColors, value: string) => void
  ) => (
    <div className="space-y-2">
      <Label htmlFor={`${colorKey}`}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={`${colorKey}-color`}
          type="color"
          value={currentValue}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="w-12 h-10 p-1"
        />
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
  
  return (
    <div className={cn("p-4 sm:p-6 space-y-4 sm:space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Tour Theme Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure and preview different tour themes to match your application style.
        </p>
      </div>
      
      <Tabs defaultValue="themes">
        <TabsList className={cn(
          "grid w-full",
          isMobile ? "grid-cols-2" : "grid-cols-3"
        )}>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          {!isMobile && <TabsTrigger value="responsive">Responsive</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="themes" className="space-y-4 mt-4">
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
                onClick={() => handleThemeChange(theme.id)}
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
            onClick={resetTheme}
            className="mt-4"
            disabled={isTransitioning || currentTheme === 'default'}
          >
            Reset to Default
          </Button>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className={cn(
            isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"
          )}>
            <div className="space-y-4">
              {renderColorPicker(
                "Accent Color", 
                "accentBlue", 
                customColors.accentBlue || '#FF5733',
                handleColorChange
              )}
              
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
            </div>
            
            <div className="space-y-4">
              {renderColorPicker(
                "Text Color", 
                "textPrimary", 
                customColors.textPrimary || '#1a1f2c',
                handleColorChange
              )}
              
              {renderColorPicker(
                "Background Color", 
                "bgPrimary", 
                customColors.bgPrimary || '#ffffff',
                handleColorChange
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleCustomTheme} 
            className="mt-4"
            disabled={isTransitioning}
          >
            Apply Custom Theme
          </Button>
          
          {isMobile && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium border-t pt-4">Responsive Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="mobile-border-radius">Mobile Border Radius</Label>
                <Input
                  id="mobile-border-radius"
                  type="text"
                  value={responsiveColors.mobile?.borderRadius || '0.375rem'}
                  onChange={(e) => handleResponsiveColorChange('mobile', 'borderRadius', e.target.value)}
                  placeholder="0.375rem"
                  className="text-sm"
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                These settings will only apply on mobile devices
              </p>
            </div>
          )}
        </TabsContent>
        
        {!isMobile && (
          <TabsContent value="responsive" className="space-y-4 mt-4">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={activeDevice === 'mobile' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDevice('mobile')}
              >
                Mobile
              </Button>
              <Button
                variant={activeDevice === 'tablet' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDevice('tablet')}
              >
                Tablet
              </Button>
              <Button
                variant={activeDevice === 'desktop' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDevice('desktop')}
              >
                Desktop
              </Button>
            </div>
            
            {activeDevice !== 'desktop' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${activeDevice}-border-radius`}>Border Radius</Label>
                  <Input
                    id={`${activeDevice}-border-radius`}
                    type="text"
                    value={responsiveColors[activeDevice]?.borderRadius || (activeDevice === 'mobile' ? '0.375rem' : '0.5rem')}
                    onChange={(e) => handleResponsiveColorChange(
                      activeDevice as 'mobile' | 'tablet', 
                      'borderRadius', 
                      e.target.value
                    )}
                    placeholder={activeDevice === 'mobile' ? '0.375rem' : '0.5rem'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`${activeDevice}-shadow`}>Shadow</Label>
                  <Input
                    id={`${activeDevice}-shadow`}
                    type="text"
                    value={responsiveColors[activeDevice]?.shadow || (activeDevice === 'mobile' ? 
                      '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)')}
                    onChange={(e) => handleResponsiveColorChange(
                      activeDevice as 'mobile' | 'tablet', 
                      'shadow', 
                      e.target.value
                    )}
                    placeholder="Shadow value"
                  />
                </div>
                
                {renderColorPicker(
                  `${activeDevice === 'mobile' ? 'Mobile' : 'Tablet'} Button Color`, 
                  "buttonPrimaryBg", 
                  responsiveColors[activeDevice]?.buttonPrimaryBg || customColors.buttonPrimaryBg || '#FF5733',
                  (key, value) => handleResponsiveColorChange(activeDevice as 'mobile' | 'tablet', key, value)
                )}
              </div>
            )}
            
            {activeDevice === 'desktop' && (
              <p className="text-sm text-muted-foreground">
                Desktop uses the base theme settings. Customize them in the "Custom" tab.
              </p>
            )}
            
            <Button 
              onClick={handleCustomTheme} 
              className="mt-4"
              disabled={isTransitioning}
            >
              Apply with Responsive Settings
            </Button>
          </TabsContent>
        )}
      </Tabs>
      
      <div className={cn(
        "space-y-4 border rounded-md p-4 mt-4",
        "bg-[color:var(--tour-tooltip-bg)] text-[color:var(--tour-tooltip-text)] border-[color:var(--tour-border-primary)]"
      )}>
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
      
      {!isMobile && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Implementation Example</h3>
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-xs overflow-auto">
{`// Import the theme hook
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';

// Inside your component
const { setTheme, currentTheme, isMobile } = useTourTheme();

// Change theme
setTheme('blue');

// Set custom theme with responsive options
setCustomThemeColors(
  { accentBlue: '#FF5733' },
  'Custom Theme',
  { duration: 300 },
  { 
    mobile: { borderRadius: '0.375rem' } 
  }
);`}
          </pre>
        </div>
      )}
    </div>
  );
};
