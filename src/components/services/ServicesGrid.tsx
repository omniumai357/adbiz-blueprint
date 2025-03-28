
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";
import { ResponsiveGrid, ResponsiveGridProps } from "@/components/ui/responsive-grid";

interface ServicesGridProps extends Omit<ResponsiveGridProps, 'children'> {
  children: React.ReactNode;
}

/**
 * ServicesGrid component
 * 
 * A specialized responsive grid layout specifically for displaying service packages.
 * Extends the base ResponsiveGrid component with service-specific styling and behavior.
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
  columns,
  ...props
}) => {
  return (
    <ResponsiveGrid
      className={cn("w-full", className)}
      minItemWidth={minItemWidth}
      gap={gap}
      columns={columns}
      equalHeight
      {...props}
    >
      {children}
    </ResponsiveGrid>
  );
};

export default ServicesGrid;
