
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  fluid?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * ResponsiveContainer component
 * 
 * A responsive container that provides consistent padding and max-width
 * across different screen sizes. Uses mobile-first approach.
 * 
 * @param fluid - Whether the container should take full width of the parent
 * @param as - The element type to render (default: div)
 */
export function ResponsiveContainer({
  as: Component = "div",
  fluid = false,
  className,
  children,
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto px-4 sm:px-6 md:px-8",
        !fluid && "max-w-[1240px]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
