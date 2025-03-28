
import React from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

interface ResponsiveCheckoutLayoutProps {
  summary: React.ReactNode;
  form: React.ReactNode;
}

/**
 * ResponsiveCheckoutLayout Component
 * 
 * Provides a responsive layout for the checkout page that adapts to different screen sizes.
 * On larger screens, displays the summary and form side by side.
 * On smaller screens, stacks them vertically with the summary first.
 */
export const ResponsiveCheckoutLayout: React.FC<ResponsiveCheckoutLayoutProps> = ({
  summary,
  form
}) => {
  const { isMobile, isTablet, atLeast } = useResponsive();
  
  return (
    <ResponsiveContainer className="py-8">
      <div className={`grid ${atLeast.lg ? 'grid-cols-3 gap-8' : 'grid-cols-1 gap-6'}`}>
        <div className={`${atLeast.lg ? 'col-span-1' : ''}`}>
          {summary}
        </div>
        <div className={`${atLeast.lg ? 'col-span-2' : ''}`}>
          {form}
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveCheckoutLayout;
