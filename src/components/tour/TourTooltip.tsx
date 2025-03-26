
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
  animation?: string;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
  };
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
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
  animation = "fade-in",
  media,
  nextLabel,
  prevLabel,
  skipLabel,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<{ top: string | number; left: string | number }>({ top: 0, left: 0 });

  useEffect(() => {
    const calculatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Add a small buffer for spacing between tooltip and target
      const buffer = 16;

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
    
    // Recalculate on window resize and scroll
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
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

  // Animation class mappings with enhanced options
  const animationClasses = {
    "fade-in": "animate-fade-in",
    "scale-in": "animate-scale-in",
    "slide-in": "animate-slide-in-right",
    "enter": "animate-enter",
    "float": "animate-float",
    "fade-up": "animate-fade-up"
  };
  
  // Render media content if provided
  const renderMedia = () => {
    if (!media) return null;
    
    switch (media.type) {
      case "image":
        return (
          <div className="mt-2 mb-3 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || title} 
              className="rounded-md max-h-32 max-w-full object-contain"
            />
          </div>
        );
      case "video":
        return (
          <div className="mt-2 mb-3 flex justify-center">
            <video 
              src={media.url} 
              className="rounded-md max-h-32 max-w-full object-contain" 
              controls
              muted
              autoPlay
              loop
            />
          </div>
        );
      case "gif":
        return (
          <div className="mt-2 mb-3 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || title} 
              className="rounded-md max-h-32 max-w-full object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className={cn(
          "absolute bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50",
          animationClasses[animation as keyof typeof animationClasses] || "animate-fade-in"
        )}
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
          className="absolute top-2 right-2 h-6 w-6 hover:bg-muted/60" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-4 mt-1">
          <h3 className="font-medium text-lg">{title}</h3>
          {renderMedia()}
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">{stepInfo}</span>
          <div className="flex gap-2">
            {!isLastStep && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose} 
                className="h-8 text-xs"
              >
                {skipLabel || "Skip"}
              </Button>
            )}
            {onPrev && (
              <Button size="sm" variant="outline" onClick={onPrev} className="h-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {prevLabel || "Prev"}
              </Button>
            )}
            <Button size="sm" onClick={onNext} className="h-8">
              {isLastStep ? 
                (nextLabel || "Finish") : 
                (nextLabel || "Next")}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
