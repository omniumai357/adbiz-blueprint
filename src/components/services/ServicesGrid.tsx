
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ServicesGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: "xs" | "sm" | "md" | "lg";
  /** 
   * Manually set the number of columns instead of auto-fill
   * This overrides responsive behavior in favor of explicit column count
   */
  columns?: 1 | 2 | 3 | 4;
}

/**
 * ServicesGrid component
 * 
 * A responsive grid layout for displaying service packages or cards.
 * Automatically adjusts columns based on screen size and available space.
 * 
 * @param minItemWidth - Minimum width for each grid item (default: 300px)
 * @param gap - Size of gap between grid items (default: "md")
 * @param columns - Explicitly set number of columns (overrides minItemWidth)
 */
export const ServicesGrid: React.FC<ServicesGridProps> = ({
  children,
  className,
  minItemWidth = 300,
  gap = "md",
  columns
}) => {
  const { isMobile, isTablet, screenWidth } = useResponsive();
  
  // Determine the gap size based on the prop and device
  const gapSize = {
    xs: isMobile ? "gap-2" : "gap-3",
    sm: isMobile ? "gap-3" : "gap-4",
    md: isMobile ? "gap-4" : "gap-6",
    lg: isMobile ? "gap-5" : "gap-8"
  }[gap];
  
  // Determine grid template columns based on columns prop or minItemWidth
  const gridColsClass = columns 
    ? {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }[columns]
    : "";
  
  // Use grid-template-columns with minmax for automatic responsive behavior
  // but only if columns prop is not provided
  const gridStyle = !columns ? {
    gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`
  } : undefined;
  
  return (
    <div 
      className={cn(
        "grid w-full",
        gapSize,
        gridColsClass,
        className
      )}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

export default ServicesGrid;
