
import { useCallback } from "react";
import { TourThemeName } from "../../types/theme";

/**
 * Hook to manage theme CSS classes
 * @returns Theme class utility functions
 */
export function useThemeClasses() {
  /**
   * Remove all theme classes from document
   */
  const removeAllThemeClasses = useCallback(() => {
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
  }, []);

  /**
   * Add theme class for a specific theme
   * @param theme Theme name
   */
  const addThemeClass = useCallback((theme: TourThemeName) => {
    if (theme !== "default" && theme !== "custom") {
      document.documentElement.classList.add(`tour-theme-${theme}`);
    }
  }, []);

  return {
    removeAllThemeClasses,
    addThemeClass
  };
}
