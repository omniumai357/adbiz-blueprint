
import { useEffect, useState, useCallback } from "react";
import { themeRegistry } from "../../services/theme-registry";
import { ThemePreset } from "../../types/theme";

/**
 * Hook to interact with the theme registry
 * @returns Theme registry functions and available themes
 */
export function useThemeRegistry() {
  const [availableThemes, setAvailableThemes] = useState<ThemePreset[]>([]);

  // Update available themes when the component mounts
  useEffect(() => {
    setAvailableThemes(themeRegistry.getThemes());
    
    // Subscribe to theme registry changes
    const handleThemeAdded = () => {
      setAvailableThemes(themeRegistry.getThemes());
    };
    
    const handleThemeRemoved = () => {
      setAvailableThemes(themeRegistry.getThemes());
    };
    
    themeRegistry.addEventListener('themeAdded', handleThemeAdded);
    themeRegistry.addEventListener('themeRemoved', handleThemeRemoved);
    
    return () => {
      themeRegistry.removeEventListener('themeAdded', handleThemeAdded);
      themeRegistry.removeEventListener('themeRemoved', handleThemeRemoved);
    };
  }, []);

  /**
   * Add a new theme to the theme registry
   * @param theme Theme preset to add
   */
  const registerTheme = useCallback((theme: ThemePreset) => {
    themeRegistry.addTheme(theme);
  }, []);

  /**
   * Remove a theme from the theme registry
   * @param themeId ID of theme to remove
   */
  const unregisterTheme = useCallback((themeId: string) => {
    // Don't allow removing built-in themes
    if (['default', 'blue', 'purple', 'green', 'amber'].includes(themeId)) {
      console.warn(`Cannot remove built-in theme "${themeId}"`);
      return false;
    }
    
    return themeRegistry.removeTheme(themeId);
  }, []);

  return {
    availableThemes,
    registerTheme,
    unregisterTheme
  };
}
