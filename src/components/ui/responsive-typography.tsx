
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The heading level (h1-h6)
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  
  /**
   * Heading content
   */
  children: React.ReactNode;
  
  /**
   * Visual size, can be different from semantic heading level
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  
  /**
   * Whether the heading should be bold
   */
  bold?: boolean;
  
  /**
   * Whether the heading should scale based on screen size
   */
  responsive?: boolean;
}

/**
 * ResponsiveHeading component
 * 
 * A heading component that automatically scales font size
 * based on the current screen size.
 */
export function ResponsiveHeading({
  as: Component = "h2",
  children,
  size = "xl",
  bold = true,
  responsive = true,
  className,
  ...props
}: ResponsiveHeadingProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Define size classes based on device type
  const getSizeClass = () => {
    if (!responsive) {
      // Non-responsive fixed sizes
      const fixedSizes = {
        xs: "text-sm",
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
        "2xl": "text-3xl",
        "3xl": "text-4xl",
        "4xl": "text-5xl"
      };
      return fixedSizes[size];
    }
    
    // Mobile sizes (smallest)
    if (isMobile) {
      const mobileSizes = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-2xl",
        "4xl": "text-3xl"
      };
      return mobileSizes[size];
    }
    
    // Tablet sizes (medium)
    if (isTablet) {
      const tabletSizes = {
        xs: "text-sm",
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
        "2xl": "text-3xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl"
      };
      return tabletSizes[size];
    }
    
    // Desktop sizes (largest)
    const desktopSizes = {
      xs: "text-sm",
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
      "3xl": "text-4xl",
      "4xl": "text-5xl"
    };
    return desktopSizes[size];
  };
  
  return (
    <Component
      className={cn(
        "tracking-tight",
        getSizeClass(),
        bold && "font-bold",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Text content
   */
  children: React.ReactNode;
  
  /**
   * Text size
   */
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  
  /**
   * Whether the text is muted (lower contrast)
   */
  muted?: boolean;
  
  /**
   * Whether to make the text responsive to screen size
   */
  responsive?: boolean;
  
  /**
   * Leading (line height) configuration
   */
  leading?: "tight" | "normal" | "relaxed";
}

/**
 * ResponsiveText component
 * 
 * A text component that automatically adjusts font size
 * based on current screen size.
 */
export function ResponsiveText({
  children,
  size = "base",
  muted = false,
  responsive = true,
  leading = "normal",
  className,
  ...props
}: ResponsiveTextProps) {
  const { isMobile } = useResponsive();
  
  // Define size classes based on device type
  const getSizeClass = () => {
    if (!responsive) {
      return `text-${size}`;
    }
    
    // On mobile, reduce text size by one step
    if (isMobile) {
      const mobileMap: Record<string, string> = {
        xs: "text-xs",
        sm: "text-xs",
        base: "text-sm",
        lg: "text-base",
        xl: "text-lg"
      };
      return mobileMap[size];
    }
    
    return `text-${size}`;
  };
  
  // Line height options
  const lineHeightClasses = {
    tight: "leading-tight",
    normal: "leading-normal",
    relaxed: "leading-relaxed"
  };
  
  return (
    <p
      className={cn(
        getSizeClass(),
        lineHeightClasses[leading],
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export default { ResponsiveHeading, ResponsiveText };
