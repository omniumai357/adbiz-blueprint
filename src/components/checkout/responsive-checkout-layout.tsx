
import React from "react";

interface ResponsiveCheckoutLayoutProps {
  summary: React.ReactNode;
  form: React.ReactNode;
}

/**
 * ResponsiveCheckoutLayout Component
 * 
 * Provides a responsive layout for the checkout page that:
 * - Shows side-by-side layout on desktop (summary on right, form on left)
 * - Stacks vertically on mobile (summary on top, form below)
 */
const ResponsiveCheckoutLayout = ({ summary, form }: ResponsiveCheckoutLayoutProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* On mobile: Full width form below summary */}
        {/* On desktop: 8 columns for form, 4 for summary */}
        <div className="lg:col-span-8 lg:order-1 order-2">
          {form}
        </div>
        
        {/* On mobile: Full width summary above form */}
        {/* On desktop: 4 columns for summary */}
        <div className="lg:col-span-4 lg:order-2 order-1 lg:sticky lg:top-24 self-start">
          {summary}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveCheckoutLayout;
