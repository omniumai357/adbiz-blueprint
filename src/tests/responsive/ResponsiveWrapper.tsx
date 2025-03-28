
/**
 * ResponsiveWrapper component for testing responsive components
 * 
 * This component simulates different viewport sizes for testing
 * responsive components in a controlled environment.
 */

import React, { ReactNode, useEffect } from 'react';
import { mockWindowSize } from './responsive-tests-setup';

interface ResponsiveWrapperProps {
  /** The component or element to render and test */
  children: ReactNode;
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels (default: 800) */
  height?: number;
  /** Optional class name for the wrapper */
  className?: string;
}

/**
 * A component that wraps children and simulates a specific viewport size
 * for visual testing of responsive components
 */
export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  width,
  height = 800,
  className
}) => {
  // Mock window size when component mounts
  useEffect(() => {
    // Store original dimensions
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    
    // Set test dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Restore original dimensions on cleanup
    return () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalHeight
      });
      
      // Trigger resize event again
      window.dispatchEvent(new Event('resize'));
    };
  }, [width, height]);
  
  return (
    <div 
      className={className || ''} 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'auto',
        resize: 'both',
        border: '1px dashed #ccc',
        position: 'relative'
      }}
      data-testid="responsive-wrapper"
      aria-label={`Viewport: ${width}×${height}px`}
    >
      <div 
        className="absolute top-0 right-0 bg-black/10 text-xs px-1 py-0.5 rounded-bl"
        style={{ fontSize: '10px' }}
      >
        {width}×{height}
      </div>
      {children}
    </div>
  );
};

export default ResponsiveWrapper;
