
import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTooltipPosition } from "./useTooltipPosition";
import { useTooltipAnimation } from "./useTooltipAnimation";
import { useLanguage } from "@/contexts/language-context";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";
import { Position } from "@/lib/tour/types";

interface TourTooltipPositionerProps {
  children: React.ReactNode;
  targetElement: HTMLElement;
  position: Position;
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
  const { getOptimalPosition, screenWidth } = useResponsiveTour();
  const [adaptedPosition, setAdaptedPosition] = useState<Position>(position);
  
  // Adapt position based on screen size and available space
  useEffect(() => {
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const optimal = getOptimalPosition(rect);
      
      // Only change position if necessary
      if (optimal !== position) {
        // Check if there's truly not enough space
        const MIN_MARGIN = 20; // Minimum margin in pixels
        
        let needsChange = false;
        
        if (position === 'left' && rect.left < 280 + MIN_MARGIN) {
          needsChange = true;
        } else if (position === 'right' && rect.right + 280 + MIN_MARGIN > screenWidth) {
          needsChange = true;
        } else if (position === 'top' && rect.top < 180 + MIN_MARGIN) {
          needsChange = true;
        } else if (position === 'bottom' && rect.bottom + 180 + MIN_MARGIN > window.innerHeight) {
          needsChange = true;
        }
        
        if (needsChange) {
          setAdaptedPosition(optimal);
        } else {
          setAdaptedPosition(position);
        }
      } else {
        setAdaptedPosition(position);
      }
    }
  }, [targetElement, position, getOptimalPosition, screenWidth]);
  
  // Use our custom hooks for positioning and animations
  const { 
    tooltipStyles, 
    arrowStyles, 
    arrowClassNames 
  } = useTooltipPosition(
    targetElement, 
    adaptedPosition, 
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
  let displayPosition = adaptedPosition;
  if (isRTL) {
    if (adaptedPosition === 'left') displayPosition = 'right';
    else if (adaptedPosition === 'right') displayPosition = 'left';
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
      data-original-position={position}
      data-adapted-position={adaptedPosition}
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
