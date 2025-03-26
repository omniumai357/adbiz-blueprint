
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TourThemeColors } from '@/lib/tour/types/theme';
import { ColorPicker } from './ColorPicker';

interface ResponsiveSettingsProps {
  activeDevice: 'mobile' | 'tablet' | 'desktop';
  responsiveColors: {
    mobile?: Partial<TourThemeColors>;
    tablet?: Partial<TourThemeColors>;
  };
  customColors: Partial<TourThemeColors>;
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onResponsiveColorChange: (device: 'mobile' | 'tablet', key: keyof TourThemeColors, value: string) => void;
  onApplyTheme: () => void;
  isTransitioning: boolean;
  className?: string;
}

export const ResponsiveSettings: React.FC<ResponsiveSettingsProps> = ({
  activeDevice,
  responsiveColors,
  customColors,
  onDeviceChange,
  onResponsiveColorChange,
  onApplyTheme,
  isTransitioning,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeDevice === 'mobile' ? "default" : "outline"}
          size="sm"
          onClick={() => onDeviceChange('mobile')}
        >
          Mobile
        </Button>
        <Button
          variant={activeDevice === 'tablet' ? "default" : "outline"}
          size="sm"
          onClick={() => onDeviceChange('tablet')}
        >
          Tablet
        </Button>
        <Button
          variant={activeDevice === 'desktop' ? "default" : "outline"}
          size="sm"
          onClick={() => onDeviceChange('desktop')}
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
              onChange={(e) => onResponsiveColorChange(
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
              onChange={(e) => onResponsiveColorChange(
                activeDevice as 'mobile' | 'tablet', 
                'shadow', 
                e.target.value
              )}
              placeholder="Shadow value"
            />
          </div>
          
          <ColorPicker
            label={`${activeDevice === 'mobile' ? 'Mobile' : 'Tablet'} Button Color`}
            colorKey="primary"
            currentValue={responsiveColors[activeDevice]?.primary || customColors.primary || '#FF5733'}
            onChange={(key, value) => onResponsiveColorChange(activeDevice as 'mobile' | 'tablet', key, value)}
          />
        </div>
      )}
      
      {activeDevice === 'desktop' && (
        <p className="text-sm text-muted-foreground">
          Desktop uses the base theme settings. Customize them in the "Custom" tab.
        </p>
      )}
      
      <Button 
        onClick={onApplyTheme} 
        className="mt-4"
        disabled={isTransitioning}
      >
        Apply with Responsive Settings
      </Button>
    </div>
  );
};
