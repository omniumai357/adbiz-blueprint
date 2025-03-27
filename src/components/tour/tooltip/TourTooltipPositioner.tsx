
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useTooltipPosition } from "./useTooltipPosition";
import { useTooltipAnimation } from "./useTooltipAnimation";
import { useLanguage } from "@/contexts/language-context";

interface TourTooltipPositionerProps {
  children: React.ReactNode;
  targetElement: HTMLElement;
  position: "top" | "right" | "bottom" | "left";
  animation?: string;
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
  tooltipRef?: React.RefObject<HTMLDivElement>;
}

export const TourTooltipPositioner = forwardRef<HTMLDivElement, TourTooltipPositionerProps>(({
  children,
  targetElement,
  position,
  animation = "fade-in",
  transition,
  spotlight,
  tooltipRef
}, ref) => {
  const { direction, isRTL } = useLanguage();
  
  // Use our custom hooks for positioning and animations
  const { 
    tooltipStyles, 
    arrowStyles, 
    arrowClassNames 
  } = useTooltipPosition(
    targetElement, 
    position, 
    transition?.duration || 300
  );
  
  const { 
    animationClass, 
    transitionClass,
    getSpotlightStyles 
  } = useTooltipAnimation(animation, transition);
  
  // Combine spotlight styles with tooltip styles if necessary
  const combinedStyles = {
    ...tooltipStyles as React.CSSProperties,
    ...getSpotlightStyles(spotlight)
  };

  // Use the provided ref or our own internal ref
  const divRef = tooltipRef || ref;

  // For RTL, we need to adjust the position attribute
  let displayPosition = position;
  if (isRTL) {
    if (position === 'left') displayPosition = 'right';
    else if (position === 'right') displayPosition = 'left';
  }

  return (
    <div 
      ref={divRef}
      className={cn(
        animationClass, 
        transitionClass,
        isRTL && "rtl"
      )}
      style={combinedStyles}
      data-tour-tooltip-position={displayPosition}
      dir={direction}
    >
      {/* Render the arrow */}
      <div 
        className={cn(
          "absolute w-3 h-3 bg-popover border-popover",
          arrowClassNames
        )}
        style={arrowStyles as React.CSSProperties}
        aria-hidden="true"
      />
      
      {/* Render the children */}
      {children}
    </div>
  );
});

TourTooltipPositioner.displayName = "TourTooltipPositioner";
