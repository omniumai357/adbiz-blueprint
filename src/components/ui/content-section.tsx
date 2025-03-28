
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

export interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to render within the section
   */
  children: React.ReactNode;
  
  /**
   * Optional heading for the section
   */
  heading?: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Background style variant
   */
  variant?: "default" | "muted" | "primary" | "secondary" | "accent";
  
  /**
   * Width constraint
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  
  /**
   * Padding size
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  
  /**
   * Whether to center the content
   */
  centered?: boolean;
  
  /**
   * Whether section has a divider
   */
  divider?: boolean;
  
  /**
   * Custom class names
   */
  className?: string;
  
  /**
   * Class name for the heading
   */
  headingClassName?: string;
  
  /**
   * Class name for the description
   */
  descriptionClassName?: string;
  
  /**
   * Class name for the content
   */
  contentClassName?: string;
}

/**
 * ContentSection component
 * 
 * A standardized, responsive container for content sections with
 * consistent padding, spacing, and optional header elements.
 */
export function ContentSection({
  children,
  heading,
  description,
  variant = "default",
  size = "lg",
  padding = "md",
  centered = false,
  divider = false,
  className,
  headingClassName,
  descriptionClassName,
  contentClassName,
  ...props
}: ContentSectionProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Determine background color based on variant
  const variantStyles = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground"
  };
  
  // Determine padding based on screen size and specified padding size
  const paddingStyles = {
    none: "p-0",
    sm: isMobile ? "px-4 py-4" : isTablet ? "px-6 py-5" : "px-8 py-6",
    md: isMobile ? "px-4 py-6" : isTablet ? "px-6 py-8" : "px-8 py-10",
    lg: isMobile ? "px-4 py-8" : isTablet ? "px-6 py-12" : "px-8 py-16",
    xl: isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-24",
  };
  
  // Determine max-width constraints based on size prop
  const sizeStyles = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-none"
  };
  
  return (
    <section
      className={cn(
        "w-full",
        variantStyles[variant],
        paddingStyles[padding],
        divider && "border-b",
        className
      )}
      {...props}
    >
      <div className={cn(
        "mx-auto w-full",
        sizeStyles[size],
        centered && "text-center",
      )}>
        {/* Section header with heading and description */}
        {(heading || description) && (
          <div className={cn(
            "mb-6 space-y-2",
            isMobile ? "mb-4" : isTablet ? "mb-6" : "mb-8"
          )}>
            {heading && (
              <h2 className={cn(
                "font-semibold tracking-tight",
                isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-4xl",
                headingClassName
              )}>
                {heading}
              </h2>
            )}
            
            {description && (
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : "text-base",
                descriptionClassName
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Main content */}
        <div className={cn(contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default ContentSection;
