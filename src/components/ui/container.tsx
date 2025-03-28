
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large" | "fluid";
}

/**
 * Container component that provides consistent horizontal spacing
 * and maximum widths following responsive design patterns
 * 
 * Features:
 * - Responsive padding that adjusts to screen size
 * - Multiple size variants for different content needs
 * - Centered content with consistent margins
 */
export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className,
  size = "default",
  ...props 
}) => {
  // Determine max-width based on size prop
  const maxWidthClass = {
    small: "max-w-screen-md",
    default: "max-w-screen-xl",
    large: "max-w-screen-2xl",
    fluid: "max-w-none"
  }[size];
  
  return (
    <div 
      className={cn(
        "w-full mx-auto px-4 sm:px-6 md:px-8", 
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
