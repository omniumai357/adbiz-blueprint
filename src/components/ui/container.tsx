
import React from "react";
import { ResponsiveContainer } from "./responsive-container";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large" | "fluid";
}

/**
 * Container component that provides consistent horizontal spacing
 * and maximum widths following responsive design patterns
 * 
 * Now uses the unified ResponsiveContainer internally.
 * Maintained for backward compatibility.
 */
export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className,
  size = "default",
  ...props 
}) => {
  // Map the old size values to the new ones
  const mappedSize = size === "small" ? "md" :
                     size === "default" ? "xl" :
                     size === "large" ? "full" :
                     size === "fluid" ? undefined : undefined;
  
  const isFluid = size === "fluid";
  
  return (
    <ResponsiveContainer
      size={mappedSize}
      fluid={isFluid}
      className={className}
      {...props}
    >
      {children}
    </ResponsiveContainer>
  );
};

export default Container;
