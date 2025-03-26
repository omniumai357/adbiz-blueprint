
/**
 * Tour theme configuration types
 */

export type TourThemeName = "default" | "blue" | "purple" | "green" | "amber" | "custom";

export interface TourThemeConfig {
  /** Current theme name */
  theme: TourThemeName;
  /** Custom colors for custom theme */
  customColors?: Record<string, string>;
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
}
