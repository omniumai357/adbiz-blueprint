
/**
 * ResponsiveTestWrapper Component
 * 
 * A wrapper component for rendering components at specific viewport sizes
 * for visual and functional testing.
 */

import React, { ReactNode, useEffect } from 'react';
import { Breakpoint } from '@/hooks/useResponsive';
import { getViewportForBreakpoint, mockWindowSize } from '../utils/ResponsiveTestingUtils';

interface ResponsiveTestWrapperProps {
  /** Component to test */
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
}

/**
 * A wrapper component for testing components at different viewport sizes
 */
const ResponsiveTestWrapper: React.FC<ResponsiveTestWrapperProps> = ({
  children,
  breakpoint,
  background = 'white',
  height,
  addPadding = true,
  className = '',
  showIndicator = true
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
      className={`relative ${className}`}
      style={{
        width: `${viewport.width}px`,
        height: `${viewportHeight}px`,
        background,
        padding: addPadding ? '16px' : '0',
        overflow: 'auto',
        border: '1px dashed #ddd',
        boxSizing: 'border-box'
      }}
      data-testid={`responsive-test-${breakpoint}`}
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
