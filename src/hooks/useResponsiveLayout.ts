
import { useState, useEffect } from 'react';
import { useResponsive } from './useResponsive';

/**
 * Available layout modes
 */
export type LayoutMode = 'stacked' | 'grid' | 'list' | 'compact' | 'expanded';

/**
 * Layout configuration options
 */
export interface LayoutConfig {
  xs?: LayoutMode;
  sm?: LayoutMode;
  md?: LayoutMode;
  lg?: LayoutMode;
  xl?: LayoutMode;
  xxl?: LayoutMode;
  default: LayoutMode;
}

/**
 * Hook for responsive layout decisions
 * 
 * @param config Layout configuration for different breakpoints
 * @returns The current layout mode based on screen size
 */
export function useResponsiveLayout(config: LayoutConfig): LayoutMode {
  const { activeBreakpoint } = useResponsive();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(config.default);
  
  useEffect(() => {
    // Determine the layout mode based on the active breakpoint
    const newLayoutMode = config[activeBreakpoint] || config.default;
    setLayoutMode(newLayoutMode);
  }, [activeBreakpoint, config]);
  
  return layoutMode;
}
