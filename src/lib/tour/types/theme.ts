
/**
 * Tour theme configuration types
 */

export type TourThemeName = "default" | "blue" | "purple" | "green" | "amber" | "playful" | "custom";

export interface TourThemeConfig {
  /** Current theme name */
  theme: TourThemeName;
  /** Custom colors for custom theme */
  customColors?: Record<string, string>;
  /** Animation properties for theme transitions */
  transitions?: {
    /** Duration of theme transition animation in ms */
    duration: number;
    /** Easing function for transition animation */
    easing: string;
  };
  /** 
   * Responsiveness options for different viewports 
   * These settings override main theme settings on specific viewports
   */
  responsive?: {
    /** Mobile viewport specific settings */
    mobile?: Partial<TourThemeColors>;
    /** Tablet viewport specific settings */
    tablet?: Partial<TourThemeColors>;
    /** Desktop viewport specific settings */
    desktop?: Partial<TourThemeColors>;
  };
}

/**
 * Theme color properties that can be customized
 */
export interface TourThemeColors {
  /** Primary background color for tooltips and components */
  bgPrimary?: string;
  /** Secondary background color used for alternating elements */
  bgSecondary?: string;
  /** Primary text color */
  textPrimary?: string;
  /** Secondary text color for less prominent text */
  textSecondary?: string;
  /** Primary border color */
  borderPrimary?: string;
  /** Highlight border color */
  borderHighlight?: string;
  /** Primary accent color used for buttons and highlights */
  accentBlue?: string;
  /** Secondary accent color */
  accentPurple?: string;
  /** Tertiary accent color */
  accentGreen?: string;
  /** Destructive action color */
  accentRed?: string;
  /** Warning or attention color */
  accentAmber?: string;
  /** Border radius for components */
  borderRadius?: string;
  /** Shadow style for tooltips */
  shadow?: string;
  /** Button primary background color */
  buttonPrimaryBg?: string;
  /** Button primary hover background color */
  buttonPrimaryHoverBg?: string;
  /** Button primary text color */
  buttonPrimaryText?: string;
  /** Button secondary background color */
  buttonSecondaryBg?: string;
  /** Button secondary hover background color */
  buttonSecondaryHoverBg?: string;
  /** Progress bar background color */
  progressBg?: string;
  /** Progress fill color */
  progressFill?: string;
  /** Spotlight glow color */
  spotlightGlow?: string;
}

/**
 * Predefined theme preset configurations
 */
export interface ThemePreset {
  /** Unique identifier for the theme preset */
  id: string;
  /** Display name of the theme preset */
  name: string;
  /** Theme colors configuration */
  colors: TourThemeColors;
  /** Optional description of the theme */
  description?: string;
  /** Optional preview image URL */
  previewUrl?: string;
  /** Optional transition effects */
  transitions?: {
    duration: number;
    easing: string;
  };
}

/**
 * Theme registry interface for theme management
 */
export interface ThemeRegistry {
  /** Get all available theme presets */
  getThemes: () => ThemePreset[];
  /** Get a specific theme preset by id */
  getTheme: (id: string) => ThemePreset | undefined;
  /** Add a new theme preset to the registry */
  addTheme: (theme: ThemePreset) => void;
  /** Remove a theme preset from the registry */
  removeTheme: (id: string) => boolean;
}
