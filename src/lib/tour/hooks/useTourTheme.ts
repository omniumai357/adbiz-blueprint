
import { useContext, useCallback } from "react";
import { useTour } from "@/contexts/tour/TourContext";

export type TourTheme = "default" | "blue" | "purple" | "green" | "amber" | "custom";

/**
 * Hook to manage tour theme
 * @returns Theme management functions and current theme
 */
export function useTourTheme() {
  const { customConfig, setCustomConfig } = useTour();
  const currentTheme = customConfig?.theme || "default";

  /**
   * Set the tour theme
   * @param theme Theme name to set
   */
  const setTheme = useCallback((theme: TourTheme) => {
    // Remove any existing theme classes
    document.documentElement.classList.remove(
      "tour-theme-blue",
      "tour-theme-purple", 
      "tour-theme-green",
      "tour-theme-amber"
    );

    // Add the new theme class if not default
    if (theme !== "default" && theme !== "custom") {
      document.documentElement.classList.add(`tour-theme-${theme}`);
    }

    // Update the theme in tour context
    setCustomConfig(prev => ({
      ...prev,
      theme
    }));
  }, [setCustomConfig]);

  /**
   * Set custom theme colors
   * @param colors Object containing CSS variable overrides
   */
  const setCustomThemeColors = useCallback((colors: Record<string, string>) => {
    // Set the theme to custom
    setTheme("custom");

    // Apply custom colors as CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--tour-${key}`, value);
    });

    // Store the custom colors in context
    setCustomConfig(prev => ({
      ...prev,
      theme: "custom",
      customColors: colors
    }));
  }, [setTheme, setCustomConfig]);

  /**
   * Reset to default theme
   */
  const resetTheme = useCallback(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "tour-theme-blue",
      "tour-theme-purple", 
      "tour-theme-green",
      "tour-theme-amber"
    );

    // Remove any custom CSS variables
    if (customConfig?.customColors) {
      Object.keys(customConfig.customColors).forEach(key => {
        document.documentElement.style.removeProperty(`--tour-${key}`);
      });
    }

    // Reset the theme in context
    setCustomConfig(prev => ({
      ...prev,
      theme: "default",
      customColors: undefined
    }));
  }, [customConfig, setCustomConfig]);

  return {
    currentTheme,
    setTheme,
    setCustomThemeColors,
    resetTheme
  };
}
