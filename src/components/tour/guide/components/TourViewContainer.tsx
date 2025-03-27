
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Define a Position type to match expected values
type Position = "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface TourViewContainerProps {
  children: React.ReactNode;
  targetElement?: HTMLElement | null;
  placement?: string;
  className?: string;
  style?: React.CSSProperties;
  isRTL?: boolean;
  direction?: 'ltr' | 'rtl';
}

export const TourViewContainer = forwardRef<HTMLDivElement, TourViewContainerProps>(
  ({ children, targetElement, placement = "bottom", className, style, isRTL = false, direction = 'ltr' }, ref) => {
    // Calculate position and dimensions based on the target element
    const calculatePosition = () => {
      if (!targetElement) return {};
      
      const targetRect = targetElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Default styles
      const baseStyles = {
        position: "absolute" as const,
        zIndex: 1000,
      };
      
      // Convert string placement to Position type to ensure type safety
      const safePosition = (placement as Position) || "bottom";
      
      // Position the tooltip based on the placement
      switch (safePosition) {
        case "top":
          return {
            ...baseStyles,
            top: targetRect.top - 10,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, -100%)",
          };
        case "right":
          return {
            ...baseStyles,
            top: targetRect.top + targetRect.height / 2,
            left: targetRect.right + 10,
            transform: "translate(0, -50%)",
          };
        case "bottom":
          return {
            ...baseStyles,
            top: targetRect.bottom + 10,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, 0)",
          };
        case "left":
          return {
            ...baseStyles,
            top: targetRect.top + targetRect.height / 2,
            left: targetRect.left - 10,
            transform: "translate(-100%, -50%)",
          };
        default:
          return {
            ...baseStyles,
            top: targetRect.bottom + 10,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, 0)",
          };
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn("tour-view-container", className)}
        style={{
          ...calculatePosition(),
          ...style,
        }}
        dir={direction}
      >
        {children}
      </div>
    );
  }
);

TourViewContainer.displayName = "TourViewContainer";
