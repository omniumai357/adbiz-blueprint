
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Position = "top" | "right" | "bottom" | "left";

interface TourTooltipProps {
  targetElement: HTMLElement;
  position?: Position;
  title: string;
  content: string;
  stepInfo: string;
  onPrev?: () => void;
  onNext: () => void;
  onClose: () => void;
  isLastStep: boolean;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  targetElement,
  position = "bottom",
  title,
  content,
  stepInfo,
  onPrev,
  onNext,
  onClose,
  isLastStep,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<{ top: string | number; left: string | number }>({ top: 0, left: 0 });

  useEffect(() => {
    const calculatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Add a small buffer for spacing between tooltip and target
      const buffer = 12;

      // Base position calculations
      const positions = {
        top: {
          top: rect.top + scrollY - buffer,
          left: rect.left + scrollX + rect.width / 2,
          arrowTop: '100%',
          arrowLeft: '50%',
          transform: 'translate(-50%, -100%)',
        },
        right: {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX + rect.width + buffer,
          arrowTop: '50%',
          arrowLeft: '0',
          transform: 'translate(0, -50%)',
        },
        bottom: {
          top: rect.top + scrollY + rect.height + buffer,
          left: rect.left + scrollX + rect.width / 2,
          arrowTop: '0',
          arrowLeft: '50%',
          transform: 'translate(-50%, 0)',
        },
        left: {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX - buffer,
          arrowTop: '50%',
          arrowLeft: '100%',
          transform: 'translate(-100%, -50%)',
        },
      };

      // Position based on specified direction
      const pos = positions[position];
      
      setTooltipPosition({
        top: pos.top,
        left: pos.left,
      });
      
      setArrowPosition({
        top: pos.arrowTop,
        left: pos.arrowLeft,
      });
    };

    calculatePosition();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [targetElement, position]);

  const tooltipStyles = {
    position: 'absolute',
    top: `${tooltipPosition.top}px`,
    left: `${tooltipPosition.left}px`,
    transform: (() => {
      switch (position) {
        case 'top': return 'translate(-50%, -100%)';
        case 'right': return 'translate(0, -50%)';
        case 'bottom': return 'translate(-50%, 0)';
        case 'left': return 'translate(-100%, -50%)';
        default: return 'translate(-50%, 0)';
      }
    })(),
  };

  const arrowStyles = {
    position: 'absolute',
    top: arrowPosition.top,
    left: arrowPosition.left,
    transform: 'translate(-50%, -50%) rotate(45deg)',
  };

  const arrowClassNames = {
    top: 'border-b border-r',
    right: 'border-l border-b',
    bottom: 'border-t border-l',
    left: 'border-t border-r',
  };

  return (
    <div 
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className="absolute bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-72 pointer-events-auto animate-fade-in border z-50"
        style={tooltipStyles as React.CSSProperties}
      >
        <div 
          className={cn(
            "absolute w-3 h-3 bg-popover border-popover",
            arrowClassNames[position]
          )}
          style={arrowStyles as React.CSSProperties}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-4 mt-1">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{content}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">{stepInfo}</span>
          <div className="flex gap-2">
            {onPrev && (
              <Button size="sm" variant="outline" onClick={onPrev}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            <Button size="sm" onClick={onNext}>
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
