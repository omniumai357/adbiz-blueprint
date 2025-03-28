
import React from "react";
import { cn } from "@/lib/utils";

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

/**
 * FormGrid Component
 * 
 * A responsive grid layout for form fields that:
 * - Shows single column on mobile
 * - Shows specified number of columns on larger screens
 */
const FormGrid = ({ 
  children, 
  columns = 2, 
  className 
}: FormGridProps) => {
  // Create grid columns classes based on the columns prop
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 sm:grid-cols-2";
    }
  };

  return (
    <div className={cn(
      "grid gap-4",
      getGridCols(),
      className
    )}>
      {children}
    </div>
  );
};

export default FormGrid;
