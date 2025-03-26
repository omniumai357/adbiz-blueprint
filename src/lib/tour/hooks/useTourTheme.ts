
import { useContext, useCallback, useEffect, useMemo } from "react";
import { useTour } from "@/contexts/tour";
import { themeRegistry, createCustomTheme } from "../services/theme-registry";
import { ThemePreset, TourThemeColors, TourThemeName } from "../types/theme";
import { useDevice } from "@/hooks/use-mobile";
import { useThemeRegistry } from "./theme/useThemeRegistry";
import { useThemeColors } from "./theme/useThemeColors";
import { useThemeTransitions } from "./theme/useThemeTransitions";
import { useThemeClasses } from "./theme/useThemeClasses";

export type TourTheme = "default" | "blue" | "purple" | "green" | "amber" | "corporate" | "minimal" | "playful" | "custom";

/**
 * Hook to manage tour theme with responsive capabilities
 * @returns Theme management functions and current theme
 */
export function useTourTheme() {
  const { customConfig, setCustomConfig } = useTour();
  const { availableThemes, registerTheme: registryAddTheme, unregisterTheme: registryRemoveTheme } = useThemeRegistry();
  const { applyThemeColors, removeThemeColors } = useThemeColors();
  const { isTransitioning, applyTransition } = useThemeTransitions();
  const { removeAllThemeClasses, addThemeClass } = useThemeClasses();
  
  const currentTheme = customConfig?.theme || "default";
  const { isMobile, isTablet, isDesktop } = useDevice();

  /**
   * Set the tour theme with responsive awareness
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
    removeAllThemeClasses();

    // Apply transition styles if provided
    const duration = transitionOptions?.duration || 
                     themePreset?.transitions?.duration || 
                     300;
    
    const easing = transitionOptions?.easing || 
                   themePreset?.transitions?.easing || 
                   'ease';
    
    // Start transition
    const completeTransition = applyTransition(duration, easing);

    // Add the new theme class if not default
    addThemeClass(theme as TourThemeName);
    
    // Detect viewport and apply the appropriate theme colors
    const viewport = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    // Apply theme colors if available with viewport awareness
    if (themePreset?.colors) {
      applyThemeColors(themePreset.colors, theme, viewport);
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
    
    // Complete the transition
    completeTransition();
  }, [
    currentTheme, 
    isTransitioning, 
    removeAllThemeClasses, 
    applyTransition, 
    addThemeClass, 
    isMobile, 
    isTablet, 
    applyThemeColors, 
    setCustomConfig
  ]);

  /**
   * Set custom theme colors with responsive options
   * @param colors Object containing CSS variable overrides
   * @param name Optional name for the custom theme
   * @param transitionOptions Optional transition options
   * @param responsiveOptions Optional responsive overrides
   */
  const setCustomThemeColors = useCallback((
    colors: TourThemeColors,
    name?: string,
    transitionOptions?: { 
      duration?: number; 
      easing?: string;
    },
    responsiveOptions?: {
      mobile?: Partial<TourThemeColors>;
      tablet?: Partial<TourThemeColors>;
      desktop?: Partial<TourThemeColors>;
    }
  ) => {
    // Create a custom theme ID
    const customThemeId = 'custom';
    const customThemeName = name || 'Custom Theme';
    
    // Create and register the custom theme with responsive options
    const customTheme = createCustomTheme(
      customThemeId,
      customThemeName,
      colors,
      {
        description: 'Custom user-defined theme',
        transitions: {
          duration: transitionOptions?.duration || 300,
          easing: transitionOptions?.easing || 'ease'
        },
        responsive: responsiveOptions
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
    removeAllThemeClasses();

    // Remove any custom CSS variables
    if (customConfig?.customColors) {
      removeThemeColors(customConfig.customColors);
    }

    // Reset the theme in context
    setCustomConfig(prev => ({
      ...prev,
      theme: "default",
      customColors: undefined
    }));
  }, [customConfig, removeAllThemeClasses, removeThemeColors, setCustomConfig]);

  // Automatic responsive theme adaptation
  useEffect(() => {
    const themePreset = themeRegistry.getTheme(currentTheme);
    if (!themePreset) return;
    
    // Detect current viewport
    const viewport = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    // Apply theme colors with viewport specific overrides
    applyThemeColors(themePreset.colors, currentTheme, viewport);
  }, [isMobile, isTablet, currentTheme, applyThemeColors]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    currentTheme,
    isTransitioning,
    availableThemes,
    setTheme,
    setCustomThemeColors,
    resetTheme,
    registerTheme: registryAddTheme,
    unregisterTheme: registryRemoveTheme,
    // Add device context to the return value
    isMobile,
    isTablet,
    isDesktop
  }), [
    currentTheme, 
    isTransitioning, 
    availableThemes, 
    setTheme, 
    setCustomThemeColors, 
    resetTheme, 
    registryAddTheme, 
    registryRemoveTheme,
    isMobile,
    isTablet,
    isDesktop
  ]);
}
