
import React from 'react';
import { getViewportByBreakpoint } from '../visualRegressionSetup';
import { Breakpoint } from '@/hooks/useResponsive';

interface ResponsiveVisualTestProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  className?: string;
  testId?: string;
  /**
   * Optional background color for the container
   * @default 'white'
   */
  background?: string;
  /**
   * Render component with more padding for visibility
   * @default true
   */
  withPadding?: boolean;
}

/**
 * A wrapper component that simulates a specific viewport size for visual testing
 * based on the specified breakpoint. This component sets appropriate dimensions
 * and creates a controlled environment for taking consistent screenshots.
 * 
 * @example
 * <ResponsiveVisualTest breakpoint="md">
 *   <YourComponent />
 * </ResponsiveVisualTest>
 */
export const ResponsiveVisualTest: React.FC<ResponsiveVisualTestProps> = ({
  children,
  breakpoint,
  className = '',
  testId,
  background = 'white',
  withPadding = true,
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
        backgroundColor: background,
        padding: withPadding ? '16px' : '0px',
      }}
      data-testid={testId || `responsive-container-${breakpoint}`}
      data-breakpoint={breakpoint}
      aria-label={`Viewport at ${breakpoint} breakpoint (${width}x${height}px)`}
    >
      {children}
    </div>
  );
};

export default ResponsiveVisualTest;
