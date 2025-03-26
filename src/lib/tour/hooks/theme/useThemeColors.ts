
import { useCallback } from "react";
import { TourThemeColors } from "../../types/theme";

/**
 * Hook to manage theme colors and CSS variables
 * @returns Theme color utility functions
 */
export function useThemeColors() {
  /**
   * Apply CSS variables to the document root
   * @param colors Theme colors to apply
   * @param viewport Optional viewport specific overrides
   */
  const applyThemeColors = useCallback((
    colors: TourThemeColors, 
    themeId: string,
    viewport?: 'mobile' | 'tablet' | 'desktop'
  ) => {
    // Get the theme preset for the given viewport if available
    const themePreset = window.themeRegistry?.getTheme?.(themeId);
    // Only access responsive property if it exists
    const viewportColors = viewport && themePreset?.responsive?.[viewport];
    
    // Merge viewport specific colors with base colors
    const mergedColors = viewportColors ? { ...colors, ...viewportColors } : colors;
    
    Object.entries(mergedColors).forEach(([key, value]) => {
      // Skip undefined values
      if (value === undefined) return;
      
      // Ensure value is a string
      const stringValue = String(value);
      
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--tour-${cssKey}`, stringValue);
    });
  }, []);

  /**
   * Remove CSS variables from document root
   * @param colors Object containing CSS variable keys to remove
   */
  const removeThemeColors = useCallback((colors: Record<string, unknown>) => {
    Object.keys(colors).forEach(key => {
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.removeProperty(`--tour-${cssKey}`);
    });
  }, []);

  return {
    applyThemeColors,
    removeThemeColors
  };
}
