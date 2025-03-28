
import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * A responsive container for form sections
 * Adapts layout and spacing based on screen size
 */
const ResponsiveFormSection: React.FC<ResponsiveFormSectionProps> = ({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <div className={cn(
      "rounded-lg border border-border p-4 md:p-6",
      isMobile ? "space-y-4" : "space-y-6",
      className
    )}>
      <div className={cn("space-y-1", headerClassName)}>
        <h3 className={cn(
          "font-medium",
          isMobile ? "text-lg" : "text-xl"
        )}>
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      
      <div className={cn(
        isMobile ? "space-y-4" : "space-y-6",
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveFormSection;
