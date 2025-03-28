
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  fluid?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children: React.ReactNode;
  /**
   * Whether to remove horizontal padding
   * @default false
   */
  noPadding?: boolean;
}

/**
 * ResponsiveContainer component - A unified container component
 * 
 * A responsive container that provides consistent padding and max-width
 * across different screen sizes. Uses mobile-first approach.
 * 
 * @param as - The element type to render (default: div)
 * @param fluid - Whether the container should take full width of the parent
 * @param size - Predefined size variant (sm, md, lg, xl, full)
 * @param noPadding - Whether to remove horizontal padding
 */
export function ResponsiveContainer({
  as: Component = "div",
  fluid = false,
  size,
  noPadding = false,
  className,
  children,
  ...props
}: ResponsiveContainerProps) {
  // Determine max-width based on size prop or fluid
  const maxWidthClass = fluid ? "w-full" : 
    size === "sm" ? "max-w-screen-sm" :
    size === "md" ? "max-w-screen-md" :
    size === "lg" ? "max-w-screen-lg" :
    size === "xl" ? "max-w-screen-xl" :
    size === "full" ? "max-w-none" :
    "max-w-[1240px]"; // Default size
  
  return (
    <Component
      className={cn(
        "w-full mx-auto",
        !noPadding && "px-4 sm:px-6 md:px-8",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Export default for backward compatibility
export default ResponsiveContainer;
