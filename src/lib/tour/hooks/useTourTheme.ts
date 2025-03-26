
import { useContext, useCallback, useEffect, useState } from "react";
import { useTour } from "@/contexts/tour";
import { themeRegistry, createCustomTheme } from "../services/theme-registry";
import { ThemePreset, TourThemeColors, TourThemeName } from "../types/theme";

export type TourTheme = "default" | "blue" | "purple" | "green" | "amber" | "corporate" | "minimal" | "playful" | "custom";

/**
 * Hook to manage tour theme
 * @returns Theme management functions and current theme
 */
export function useTourTheme() {
  const { customConfig, setCustomConfig } = useTour();
  const [availableThemes, setAvailableThemes] = useState<ThemePreset[]>([]);
  const currentTheme = customConfig?.theme || "default";
  const [isTransitioning, setIsTransitioning] = useState(false);

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
   * Apply CSS variables to the document root
   * @param colors Theme colors to apply
   */
  const applyThemeColors = useCallback((colors: TourThemeColors) => {
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--tour-${cssKey}`, value);
    });
  }, []);

  /**
   * Set the tour theme
   * @param theme Theme name to set
   * @param transitionOptions Optional transition options
   */
  const setTheme = useCallback((
    theme: TourTheme, 
    transitionOptions?: { 
      duration?: number; 
      easing?: string;
    }
  ) => {
    // Don't do anything if the theme is already set
    if (theme === currentTheme && !isTransitioning) return;
    
    // Get theme preset from registry
    const themePreset = themeRegistry.getTheme(theme);
    
    if (!themePreset && theme !== 'custom') {
      console.warn(`Theme "${theme}" not found in registry, using default`);
      return;
    }
    
    // Remove any existing theme classes
    document.documentElement.classList.remove(
      "tour-theme-blue",
      "tour-theme-purple", 
      "tour-theme-green",
      "tour-theme-amber",
      "tour-theme-corporate",
      "tour-theme-minimal",
      "tour-theme-playful",
      "tour-theme-custom"
    );

    // Set transition state
    setIsTransitioning(true);
    
    // Apply transition styles if provided
    const duration = transitionOptions?.duration || 
                     themePreset?.transitions?.duration || 
                     300;
    
    const easing = transitionOptions?.easing || 
                   themePreset?.transitions?.easing || 
                   'ease';
    
    document.documentElement.style.setProperty('--tour-transition-duration', `${duration}ms`);
    document.documentElement.style.setProperty('--tour-transition-easing', easing);
    
    // Add transition classes
    document.documentElement.classList.add('tour-theme-transitioning');

    // Add the new theme class if not default
    if (theme !== "default" && theme !== "custom") {
      document.documentElement.classList.add(`tour-theme-${theme}`);
    }
    
    // Apply theme colors if available
    if (themePreset?.colors) {
      applyThemeColors(themePreset.colors);
    }

    // Update the theme in tour context
    setCustomConfig(prev => ({
      ...prev,
      theme: theme as TourThemeName,
      // Store transition preferences
      transitions: {
        duration,
        easing
      }
    }));
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('tour-theme-transitioning');
      setIsTransitioning(false);
    }, duration);
  }, [currentTheme, isTransitioning, setCustomConfig, applyThemeColors]);

  /**
   * Set custom theme colors
   * @param colors Object containing CSS variable overrides
   * @param name Optional name for the custom theme
   * @param transitionOptions Optional transition options
   */
  const setCustomThemeColors = useCallback((
    colors: TourThemeColors,
    name?: string,
    transitionOptions?: { 
      duration?: number; 
      easing?: string;
    }
  ) => {
    // Create a custom theme ID
    const customThemeId = 'custom';
    const customThemeName = name || 'Custom Theme';
    
    // Create and register the custom theme
    const customTheme = createCustomTheme(
      customThemeId,
      customThemeName,
      colors,
      {
        description: 'Custom user-defined theme',
        transitions: {
          duration: transitionOptions?.duration || 300,
          easing: transitionOptions?.easing || 'ease'
        }
      }
    );
    
    // Register or update the custom theme
    themeRegistry.addTheme(customTheme);
    
    // Set the theme to custom
    setTheme("custom", transitionOptions);
  }, [setTheme]);

  /**
   * Reset to default theme
   */
  const resetTheme = useCallback(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "tour-theme-blue",
      "tour-theme-purple", 
      "tour-theme-green",
      "tour-theme-amber",
      "tour-theme-corporate",
      "tour-theme-minimal",
      "tour-theme-playful",
      "tour-theme-custom",
      "tour-theme-transitioning"
    );

    // Remove any custom CSS variables
    if (customConfig?.customColors) {
      Object.keys(customConfig.customColors).forEach(key => {
        // Convert camelCase to kebab-case for CSS variables
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        document.documentElement.style.removeProperty(`--tour-${cssKey}`);
      });
    }

    // Reset the theme in context
    setCustomConfig(prev => ({
      ...prev,
      theme: "default",
      customColors: undefined
    }));
  }, [customConfig, setCustomConfig]);

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
    currentTheme,
    isTransitioning,
    availableThemes,
    setTheme,
    setCustomThemeColors,
    resetTheme,
    registerTheme,
    unregisterTheme
  };
}
