
/**
 * Responsive Test Wrapper Component
 * 
 * A standardized wrapper component for testing components at specific viewport sizes.
 * This can be used for both visual regression tests and functional tests.
 */

import React, { ReactNode, useEffect } from 'react';
import { Breakpoint } from '@/hooks/useResponsive';
import { getViewportForBreakpoint, mockWindowSize } from '../utils/responsiveTesting';

interface ResponsiveTestWrapperProps {
  /** Component or content to test */
  children: ReactNode;
  /** Breakpoint to test at */
  breakpoint: Breakpoint;
  /** Optional background color */
  background?: string;
  /** Optional height override */
  height?: number;
  /** Whether to add padding */
  addPadding?: boolean;
  /** Custom styles */
  className?: string;
  /** Whether to show a breakpoint indicator */
  showIndicator?: boolean;
  /** Test ID for testing */
  testId?: string;
}

/**
 * A wrapper component for testing components at different viewport sizes
 * that works for both visual and functional tests
 * 
 * @example
 * // Visual testing
 * <ResponsiveTestWrapper breakpoint="md">
 *   <ComponentToTest />
 * </ResponsiveTestWrapper>
 * 
 * // Functional testing with React Testing Library
 * render(
 *   <ResponsiveTestWrapper breakpoint="xs">
 *     <ComponentToTest />
 *   </ResponsiveTestWrapper>
 * );
 */
const ResponsiveTestWrapper: React.FC<ResponsiveTestWrapperProps> = ({
  children,
  breakpoint,
  background = 'white',
  height,
  addPadding = true,
  className = '',
  showIndicator = true,
  testId
}) => {
  const viewport = getViewportForBreakpoint(breakpoint);
  const viewportHeight = height || viewport.height;
  
  // Mock window size on mount
  useEffect(() => {
    const cleanup = mockWindowSize(viewport.width, viewportHeight);
    return cleanup;
  }, [viewport.width, viewportHeight]);
  
  return (
    <div
      className={`responsive-test-wrapper relative ${className}`}
      style={{
        width: `${viewport.width}px`,
        height: `${viewportHeight}px`,
        background,
        padding: addPadding ? '16px' : '0',
        overflow: 'auto',
        border: '1px dashed #ddd',
        boxSizing: 'border-box'
      }}
      data-testid={testId || `responsive-test-${breakpoint}`}
      data-breakpoint={breakpoint}
      aria-label={`Viewport: ${viewport.width}×${viewportHeight}px`}
    >
      {showIndicator && (
        <div
          className="absolute top-0 right-0 text-xs text-white bg-black/50 px-1 py-0.5 rounded-bl z-50"
        >
          {breakpoint}: {viewport.width}px
        </div>
      )}
      {children}
    </div>
  );
};

export default ResponsiveTestWrapper;
