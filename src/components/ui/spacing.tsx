
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Vertical size of the spacer
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  
  /**
   * Whether the spacer is visible (with a border)
   */
  visible?: boolean;
  
  /**
   * Custom height that overrides default spacing
   */
  height?: string | number;
  
  /**
   * Whether to scale the spacer based on screen size
   */
  responsive?: boolean;
}

/**
 * Spacer component
 * 
 * Creates consistent vertical spacing between elements
 * with responsive sizing based on screen size.
 */
export function Spacer({
  size = "md",
  visible = false,
  height,
  responsive = true,
  className,
  ...props
}: SpacerProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Define responsive spacing sizes
  const getSizeClass = () => {
    if (height) {
      return `h-[${height}]`;
    }
    
    if (!responsive) {
      // Fixed sizes regardless of screen size
      const fixedSizes = {
        xs: "h-2",
        sm: "h-4",
        md: "h-8",
        lg: "h-12",
        xl: "h-16",
        xxl: "h-24"
      };
      return fixedSizes[size];
    }
    
    // Responsive sizes that adjust based on screen size
    if (isMobile) {
      const mobileSizes = {
        xs: "h-1",
        sm: "h-2",
        md: "h-4",
        lg: "h-6",
        xl: "h-8",
        xxl: "h-12"
      };
      return mobileSizes[size];
    }
    
    if (isTablet) {
      const tabletSizes = {
        xs: "h-1.5",
        sm: "h-3",
        md: "h-6",
        lg: "h-8",
        xl: "h-12",
        xxl: "h-16"
      };
      return tabletSizes[size];
    }
    
    // Desktop sizes
    const desktopSizes = {
      xs: "h-2",
      sm: "h-4",
      md: "h-8",
      lg: "h-12",
      xl: "h-16",
      xxl: "h-24"
    };
    return desktopSizes[size];
  };
  
  return (
    <div
      className={cn(
        getSizeClass(),
        visible && "border-t border-border",
        className
      )}
      {...props}
    />
  );
}

interface ContentStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to render within the stack
   */
  children: React.ReactNode;
  
  /**
   * Spacing between items
   */
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  
  /**
   * Whether to scale spacing based on screen size
   */
  responsive?: boolean;
}

/**
 * ContentStack component
 * 
 * Creates a vertical stack of elements with consistent spacing
 * that adapts to different screen sizes.
 */
export function ContentStack({
  children,
  spacing = "md",
  responsive = true,
  className,
  ...props
}: ContentStackProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Define responsive gap sizes
  const getGapClass = () => {
    if (!responsive) {
      // Fixed gaps regardless of screen size
      const fixedGaps = {
        xs: "gap-2",
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12"
      };
      return fixedGaps[spacing];
    }
    
    // Responsive gaps that adjust based on screen size
    if (isMobile) {
      const mobileGaps = {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8"
      };
      return mobileGaps[spacing];
    }
    
    if (isTablet) {
      const tabletGaps = {
        xs: "gap-1.5",
        sm: "gap-3",
        md: "gap-5",
        lg: "gap-7",
        xl: "gap-10"
      };
      return tabletGaps[spacing];
    }
    
    // Desktop gaps
    const desktopGaps = {
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12"
    };
    return desktopGaps[spacing];
  };
  
  return (
    <div
      className={cn(
        "flex flex-col",
        getGapClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default { Spacer, ContentStack };
