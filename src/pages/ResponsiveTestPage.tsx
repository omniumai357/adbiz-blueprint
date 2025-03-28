
import React from 'react';
import { useResponsive, Breakpoint } from '@/hooks/useResponsive';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

/**
 * Test page for demonstrating responsive behavior across breakpoints
 * 
 * This page provides visual feedback on the current screen size,
 * active breakpoint, and responsive behavior.
 */
const ResponsiveTestPage: React.FC = () => {
  const responsiveData = useResponsive();
  
  // Generate a color based on the current breakpoint for visual feedback
  const getBreakpointColor = (breakpoint: Breakpoint) => {
    switch (breakpoint) {
      case 'xs': return 'bg-red-200 dark:bg-red-900';
      case 'sm': return 'bg-orange-200 dark:bg-orange-900';
      case 'md': return 'bg-yellow-200 dark:bg-yellow-900';
      case 'lg': return 'bg-green-200 dark:bg-green-900';
      case 'xl': return 'bg-blue-200 dark:bg-blue-900';
      case 'xxl': return 'bg-purple-200 dark:bg-purple-900';
    }
  };

  return (
    <ResponsiveContainer className="py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        Responsive Testing Page
      </h1>
      
      <div className={`p-4 mb-6 rounded-lg ${getBreakpointColor(responsiveData.activeBreakpoint)}`}>
        <h2 className="text-xl font-semibold mb-2">Current Breakpoint: {responsiveData.activeBreakpoint}</h2>
        <p>Screen dimensions: {responsiveData.screenWidth}px × {responsiveData.screenHeight}px</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Device Type</h3>
          <ul className="space-y-1">
            <li>Mobile: {responsiveData.isMobile ? '✅' : '❌'}</li>
            <li>Tablet: {responsiveData.isTablet ? '✅' : '❌'}</li>
            <li>Desktop: {responsiveData.isDesktop ? '✅' : '❌'}</li>
          </ul>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Orientation & Features</h3>
          <ul className="space-y-1">
            <li>Portrait: {responsiveData.isPortrait ? '✅' : '❌'}</li>
            <li>Landscape: {responsiveData.isLandscape ? '✅' : '❌'}</li>
            <li>Touch Support: {responsiveData.hasTouchSupport ? '✅' : '❌'}</li>
            <li>High DPI: {responsiveData.isHighDPI ? '✅' : '❌'}</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-8">
        {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[]).map(bp => (
          <div 
            key={bp}
            className={`
              p-4 rounded-lg text-center 
              ${responsiveData.activeBreakpoint === bp ? 'ring-2 ring-primary font-bold' : 'opacity-60'}
            `}
          >
            {bp.toUpperCase()}
          </div>
        ))}
      </div>
      
      <div className="border rounded-lg p-4 mb-8">
        <h3 className="font-semibold mb-2">Breakpoint Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">At Least</h4>
            <ul className="space-y-1 text-sm">
              {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[]).map(bp => (
                <li key={`at-least-${bp}`}>
                  {bp}: {responsiveData.atLeast[bp] ? '✅' : '❌'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">At Most</h4>
            <ul className="space-y-1 text-sm">
              {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[]).map(bp => (
                <li key={`at-most-${bp}`}>
                  {bp}: {responsiveData.atMost[bp] ? '✅' : '❌'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Responsive Components Demo */}
      <h2 className="text-xl font-semibold mb-4">Responsive Components Demo</h2>
      <div className="space-y-6">
        {/* Demo components would be added here */}
        <div className="border rounded-lg p-4">
          <p className="text-center text-gray-500">Component demos will be added here</p>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveTestPage;
