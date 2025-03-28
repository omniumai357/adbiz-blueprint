
import React from 'react';
import { getViewportByBreakpoint } from '../visualRegressionSetup';
import { Breakpoint } from '@/hooks/useResponsive';

interface ResponsiveVisualTestProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  className?: string;
}

/**
 * A wrapper component that sets the viewport size for visual testing
 * based on the specified breakpoint
 */
export const ResponsiveVisualTest: React.FC<ResponsiveVisualTestProps> = ({
  children,
  breakpoint,
  className = '',
}) => {
  const { width, height } = getViewportByBreakpoint(breakpoint);
  
  // Set the viewport size using CSS
  return (
    <div
      className={`responsive-test-container ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        resize: 'none',
        border: '1px dashed #ccc',
        backgroundColor: 'white',
        padding: '16px',
      }}
      data-testid={`responsive-container-${breakpoint}`}
      data-breakpoint={breakpoint}
    >
      {children}
    </div>
  );
};

export default ResponsiveVisualTest;
