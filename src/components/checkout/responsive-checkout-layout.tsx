
import React from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

interface ResponsiveCheckoutLayoutProps {
  summary: React.ReactNode;
  form: React.ReactNode;
  className?: string;
  summaryClassName?: string;
  formClassName?: string;
}

/**
 * Responsive layout component for the checkout page
 * 
 * Arranges the summary and form components based on screen size
 * On mobile/tablet, places the summary above the form
 * On desktop, places the summary on the right side
 */
const ResponsiveCheckoutLayout: React.FC<ResponsiveCheckoutLayoutProps> = ({
  summary,
  form,
  className,
  summaryClassName,
  formClassName
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  // On mobile and tablet, display summary and form in a column
  // On desktop, display them side by side
  return (
    <div className={cn("max-w-7xl mx-auto px-4 md:px-6 lg:px-8", className)}>
      {(isMobile || isTablet) ? (
        // Mobile/tablet layout (stacked)
        <div className="space-y-6">
          <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", summaryClassName)}>
            {summary}
          </div>
          <div className={cn("bg-white rounded-lg shadow-md overflow-hidden p-6", formClassName)}>
            {form}
          </div>
        </div>
      ) : (
        // Desktop layout (side by side)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={cn("lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden p-6", formClassName)}>
            {form}
          </div>
          <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", summaryClassName)}>
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCheckoutLayout;
