
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TourThemeColors } from '@/lib/tour/types/theme';

interface ColorPickerProps {
  label: string;
  colorKey: keyof TourThemeColors;
  currentValue: string;
  onChange: (key: keyof TourThemeColors, value: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  colorKey,
  currentValue,
  onChange,
  className
}) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
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
};
