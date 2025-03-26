
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
    animation?: string;
  };
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
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
  transition,
  spotlight
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<{ top: string | number; left: string | number }>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay showing the tooltip to allow for animation
    const timer = setTimeout(() => setVisible(true), 50);
    
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
      clearTimeout(timer);
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
    opacity: visible ? 1 : 0,
    transition: `opacity ${transition?.duration || 300}ms ease-in-out, transform ${transition?.duration || 300}ms ease-in-out`,
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

  // Enhanced animation class mappings with more options
  const animationClasses = {
    "fade-in": "animate-fade-in",
    "scale-in": "animate-scale-in",
    "slide-in": "animate-slide-in-right",
    "enter": "animate-enter",
    "float": "animate-float",
    "fade-up": "animate-fade-up",
    "zoom-in": "animate-[scale-in_0.3s_ease-out]",
    "bounce": "animate-[bounce_0.5s_ease-in-out]",
    "slide-up": "animate-[slide-up_0.3s_ease-out]",
    "slide-down": "animate-[slide-down_0.3s_ease-out]",
    "pulse": "animate-pulse",
    "spin": "animate-spin",
  };
  
  // Transition class mappings based on transition type and direction
  const getTransitionClass = () => {
    if (!transition || transition.type === "none") return "";
    
    const { type, direction = "right" } = transition;
    
    const transitionMappings = {
      fade: "animate-fade-in",
      slide: `animate-slide-in-${direction}`,
      zoom: "animate-scale-in",
      flip: "animate-flip",
    };
    
    return transitionMappings[type] || "";
  };
  
  // Render media content if provided with enhanced animations
  const renderMedia = () => {
    if (!media) return null;
    
    const mediaAnimation = media.animation || "fade-in";
    const animationClass = animationClasses[mediaAnimation as keyof typeof animationClasses] || "animate-fade-in";
    
    switch (media.type) {
      case "image":
        return (
          <div className="mt-2 mb-3 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || title} 
              className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass)}
            />
          </div>
        );
      case "video":
        return (
          <div className="mt-2 mb-3 flex justify-center">
            <video 
              src={media.url} 
              className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass)}
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
              className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Dynamic spotlight styles based on spotlight config
  const getSpotlightStyles = () => {
    if (!spotlight) return {};
    
    const intensityMap = {
      low: "0 0 15px 2px",
      medium: "0 0 20px 5px",
      high: "0 0 30px 8px",
    };
    
    const shadowSize = intensityMap[spotlight.intensity || "medium"];
    const shadowColor = spotlight.color || "rgba(139, 92, 246, 0.7)";
    
    return {
      boxShadow: `${shadowSize} ${shadowColor}`,
      animation: spotlight.pulseEffect ? "pulse 2s infinite" : "none",
    };
  };

  return (
    <div 
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className={cn(
          "absolute bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50",
          animationClasses[animation as keyof typeof animationClasses] || "animate-fade-in",
          getTransitionClass()
        )}
        style={{ ...tooltipStyles as React.CSSProperties, ...getSpotlightStyles() }}
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
