
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemePreviewProps {
  className?: string;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ className }) => {
  return (
    <div className={cn(
      "space-y-4 border rounded-md p-4 mt-4",
      "bg-[color:var(--tour-tooltip-bg)] text-[color:var(--tour-tooltip-text)] border-[color:var(--tour-border-primary)]",
      className
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
  );
};
