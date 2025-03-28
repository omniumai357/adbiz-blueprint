
/**
 * ResponsiveVisualTest component
 * 
 * A helper component that renders a component at different breakpoints
 * for visual testing purposes.
 */

import React, { ReactElement, useEffect } from 'react';
import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';

interface ResponsiveVisualTestProps {
  /** Component to render for visual testing */
  children: ReactElement;
  /** Current breakpoint to simulate */
  breakpoint: Breakpoint;
  /** Optional background color */
  background?: string;
  /** Optional height (default: 500px) */
  height?: number;
  /** Whether to add padding around the component */
  addPadding?: boolean;
}

/**
 * Component for rendering UI components in a controlled viewport
 * for visual testing purposes
 */
const ResponsiveVisualTest: React.FC<ResponsiveVisualTestProps> = ({
  children,
  breakpoint,
  background = 'white',
  height = 500,
  addPadding = true
}) => {
  // Get width for the specified breakpoint
  const getBreakpointWidth = (): number => {
    switch (breakpoint) {
      case 'xs': return 375;
      case 'sm': return 640;
      case 'md': return 768;
      case 'lg': return 1024;
      case 'xl': return 1280;
      case 'xxl': return 1920;
      default: return 1024;
    }
  };
  
  const width = getBreakpointWidth();
  
  // Set up mock window dimensions
  useEffect(() => {
    // Store original values
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    
    // Override for test
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
    
    // Clean up
    return () => {
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      window.dispatchEvent(new Event('resize'));
    };
  }, [width, height]);
  
  return (
    <div 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        background,
        overflow: 'auto',
        padding: addPadding ? '16px' : '0',
        position: 'relative',
        boxSizing: 'border-box'
      }}
      data-testid={`responsive-test-${breakpoint}`}
      className="relative"
    >
      {/* Breakpoint indicator */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.3)',
          color: 'white',
          padding: '2px 4px',
          fontSize: '10px',
          borderBottomLeftRadius: '4px',
          zIndex: 1000
        }}
      >
        {breakpoint}: {width}px
      </div>
      
      {/* The actual component being tested */}
      {children}
    </div>
  );
};

export default ResponsiveVisualTest;
