
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeExampleProps {
  isMobile?: boolean;
  className?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({ 
  isMobile = false,
  className 
}) => {
  if (isMobile) return null;
  
  return (
    <div className={cn("mt-6", className)}>
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
  );
};
