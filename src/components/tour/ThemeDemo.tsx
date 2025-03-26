
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';
import { cn } from '@/lib/utils';
import { TourThemeColors } from '@/lib/tour/types/theme';
import { useDevice } from '@/hooks/use-mobile';
import { ThemeSelector } from './theme/ThemeSelector';
import { CustomThemeForm } from './theme/CustomThemeForm';
import { ResponsiveSettings } from './theme/ResponsiveSettings';
import { ThemePreview } from './theme/ThemePreview';
import { CodeExample } from './theme/CodeExample';

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
          <ThemeSelector 
            availableThemes={availableThemes}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            onReset={resetTheme}
            isMobile={isMobile}
            isTablet={isTablet}
            isTransitioning={isTransitioning}
          />
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <CustomThemeForm 
            customColors={customColors}
            responsiveColors={responsiveColors}
            onCustomColorChange={handleColorChange}
            onResponsiveColorChange={handleResponsiveColorChange}
            onApplyTheme={handleCustomTheme}
            isTransitioning={isTransitioning}
            isMobile={isMobile}
          />
        </TabsContent>
        
        {!isMobile && (
          <TabsContent value="responsive" className="space-y-4 mt-4">
            <ResponsiveSettings 
              activeDevice={activeDevice}
              responsiveColors={responsiveColors}
              customColors={customColors}
              onDeviceChange={setActiveDevice}
              onResponsiveColorChange={handleResponsiveColorChange}
              onApplyTheme={handleCustomTheme}
              isTransitioning={isTransitioning}
            />
          </TabsContent>
        )}
      </Tabs>
      
      <ThemePreview />
      
      <CodeExample isMobile={isMobile} />
    </div>
  );
};
