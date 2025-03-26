
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TourThemeColors } from '@/lib/tour/types/theme';
import { ColorPicker } from './ColorPicker';

interface CustomThemeFormProps {
  customColors: TourThemeColors;
  responsiveColors: {
    mobile?: Partial<TourThemeColors>;
    tablet?: Partial<TourThemeColors>;
  };
  onCustomColorChange: (key: keyof TourThemeColors, value: string) => void;
  onResponsiveColorChange: (device: 'mobile' | 'tablet', key: keyof TourThemeColors, value: string) => void;
  onApplyTheme: () => void;
  isTransitioning: boolean;
  isMobile?: boolean;
  className?: string;
}

export const CustomThemeForm: React.FC<CustomThemeFormProps> = ({
  customColors,
  responsiveColors,
  onCustomColorChange,
  onResponsiveColorChange,
  onApplyTheme,
  isTransitioning,
  isMobile,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(
        isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"
      )}>
        <div className="space-y-4">
          <ColorPicker
            label="Accent Color" 
            colorKey="accentBlue" 
            currentValue={customColors.accentBlue || '#FF5733'}
            onChange={onCustomColorChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius</Label>
            <Input
              id="borderRadius"
              type="text"
              value={customColors.borderRadius || '0.5rem'}
              onChange={(e) => onCustomColorChange('borderRadius', e.target.value)}
              placeholder="0.5rem"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <ColorPicker
            label="Text Color" 
            colorKey="textPrimary" 
            currentValue={customColors.textPrimary || '#1a1f2c'}
            onChange={onCustomColorChange}
          />
          
          <ColorPicker
            label="Background Color" 
            colorKey="bgPrimary" 
            currentValue={customColors.bgPrimary || '#ffffff'}
            onChange={onCustomColorChange}
          />
        </div>
      </div>
      
      <Button 
        onClick={onApplyTheme} 
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
              onChange={(e) => onResponsiveColorChange('mobile', 'borderRadius', e.target.value)}
              placeholder="0.375rem"
              className="text-sm"
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            These settings will only apply on mobile devices
          </p>
        </div>
      )}
    </div>
  );
};
