
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Minimum width for each grid item when using auto-fill mode
   * @default 300
   */
  minItemWidth?: number;
  /**
   * Gap size between grid items
   * @default "md"
   */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Explicitly set the number of columns
   * This overrides the minItemWidth setting
   */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Equal height items
   * @default false
   */
  equalHeight?: boolean;
}

/**
 * ResponsiveGrid component
 * 
 * A flexible grid layout component that adapts to different screen sizes.
 * Can either automatically determine columns based on minItemWidth,
 * or explicitly set columns at different breakpoints.
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  minItemWidth = 300,
  gap = "md",
  columns,
  equalHeight = false,
  ...props
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  // Define gap sizes for different device types
  const gapSizes = {
    xs: isMobile ? "gap-2" : "gap-3",
    sm: isMobile ? "gap-3" : "gap-4",
    md: isMobile ? "gap-4" : "gap-6",
    lg: isMobile ? "gap-5" : "gap-8",
    xl: isMobile ? "gap-6" : "gap-10"
  };
  
  // Get the appropriate gap class
  const gapClass = gapSizes[gap];
  
  // Determine grid columns class based on columns prop
  const columnsClass = columns 
    ? {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      }[columns]
    : "";
  
  // Dynamic grid style for when columns is not specified
  const gridStyle = !columns ? {
    gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`
  } : undefined;
  
  return (
    <div 
      className={cn(
        "grid w-full",
        gapClass,
        columnsClass,
        equalHeight && "grid-flow-row auto-rows-fr",
        className
      )}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
