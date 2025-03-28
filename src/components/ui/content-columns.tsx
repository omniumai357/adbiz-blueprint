
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ContentColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Left column content
   */
  left: React.ReactNode;
  
  /**
   * Right column content
   */
  right: React.ReactNode;
  
  /**
   * Column layout on larger screens
   * - "equal": Equal width columns (50/50)
   * - "left-wide": Left column wider (60/40)
   * - "right-wide": Right column wider (40/60)
   * - "custom": Uses leftWidth and rightWidth for custom sizing
   */
  distribution?: "equal" | "left-wide" | "right-wide" | "custom";
  
  /**
   * Custom width for left column (if distribution is "custom")
   */
  leftWidth?: string;
  
  /**
   * Custom width for right column (if distribution is "custom")
   */
  rightWidth?: string;
  
  /**
   * Alignment of columns
   */
  alignment?: "top" | "center" | "bottom";
  
  /**
   * Spacing between columns
   */
  gap?: "sm" | "md" | "lg" | "xl";
  
  /**
   * Reverse column order on mobile
   */
  reverseMobile?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Left column class names
   */
  leftClassName?: string;
  
  /**
   * Right column class names
   */
  rightClassName?: string;
}

/**
 * ContentColumns component
 * 
 * A responsive two-column layout that adapts to different screen sizes.
 * On mobile, it stacks columns vertically; on larger screens, it displays
 * them side by side with configurable widths.
 */
export function ContentColumns({
  left,
  right,
  distribution = "equal",
  leftWidth = "50%",
  rightWidth = "50%",
  alignment = "top",
  gap = "md",
  reverseMobile = false,
  className,
  leftClassName,
  rightClassName,
  ...props
}: ContentColumnsProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Define gap sizes based on breakpoint
  const gapSizes = {
    sm: isMobile ? "gap-4" : "gap-6",
    md: isMobile ? "gap-6" : "gap-8",
    lg: isMobile ? "gap-8" : "gap-12",
    xl: isMobile ? "gap-12" : "gap-16",
  };
  
  // Define column width distribution
  const getColumnWidths = () => {
    if (isMobile) return {}; // On mobile, columns stack so no need for width
    
    switch (distribution) {
      case "equal":
        return { leftWidth: "50%", rightWidth: "50%" };
      case "left-wide":
        return { leftWidth: "60%", rightWidth: "40%" };
      case "right-wide":
        return { leftWidth: "40%", rightWidth: "60%" };
      case "custom":
        return { leftWidth, rightWidth };
      default:
        return { leftWidth: "50%", rightWidth: "50%" };
    }
  };
  
  const { leftWidth: computedLeftWidth, rightWidth: computedRightWidth } = getColumnWidths();
  
  // Define column alignment
  const alignmentStyles = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end"
  };
  
  return (
    <div
      className={cn(
        "w-full",
        isMobile ? "flex flex-col" : "flex flex-row",
        gapSizes[gap],
        alignmentStyles[alignment],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "w-full",
          !isMobile && { "w-[var(--left-width)]": computedLeftWidth },
          reverseMobile && isMobile && "order-2",
          leftClassName
        )}
        style={!isMobile ? { "--left-width": computedLeftWidth } as React.CSSProperties : {}}
      >
        {left}
      </div>
      
      <div
        className={cn(
          "w-full",
          !isMobile && { "w-[var(--right-width)]": computedRightWidth },
          reverseMobile && isMobile && "order-1",
          rightClassName
        )}
        style={!isMobile ? { "--right-width": computedRightWidth } as React.CSSProperties : {}}
      >
        {right}
      </div>
    </div>
  );
}

export default ContentColumns;
