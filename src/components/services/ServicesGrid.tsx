
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ServicesGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: "sm" | "md" | "lg";
}

/**
 * ServicesGrid component
 * 
 * A responsive grid layout for displaying service packages or cards.
 * Automatically adjusts columns based on screen size and available space.
 */
export const ServicesGrid: React.FC<ServicesGridProps> = ({
  children,
  className,
  minItemWidth = 300,
  gap = "md"
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  // Determine the gap size based on the prop and device
  const gapSize = isMobile
    ? { sm: "gap-3", md: "gap-4", lg: "gap-5" }[gap]
    : { sm: "gap-4", md: "gap-6", lg: "gap-8" }[gap];
  
  return (
    <div 
      className={cn(
        "grid w-full",
        gapSize,
        {
          "grid-cols-1": isMobile,
          "grid-cols-2": isTablet && !isMobile,
          "md:grid-cols-2 lg:grid-cols-3": !isTablet && !isMobile
        },
        className
      )}
    >
      {children}
    </div>
  );
}
