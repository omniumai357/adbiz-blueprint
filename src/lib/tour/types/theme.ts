
export type TourThemeName = 
  | "default"
  | "blue"
  | "purple" 
  | "green"
  | "amber"
  | "dark"
  | "contrast"
  | "custom";

export interface TourThemeColors {
  // Core required properties
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  accent: string;
  
  // Extended theme properties
  accentBlue?: string;
  accentPurple?: string;
  accentGreen?: string;
  accentRed?: string;
  accentAmber?: string;
  
  borderHighlight?: string;
  borderPrimary?: string;
  borderRadius?: string;
  
  textPrimary?: string;
  textSecondary?: string;
  
  bgPrimary?: string;
  bgSecondary?: string;
  
  buttonPrimaryBg?: string;
  buttonPrimaryHoverBg?: string;
  
  progressFill?: string;
  spotlightGlow?: string;
  
  shadow?: string;
}

export interface TourThemeOptions {
  name: TourThemeName;
  colors: TourThemeColors;
  borderRadius?: string;
  boxShadow?: string;
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
  };
  animations?: {
    duration?: string;
    easing?: string;
  };
}

// Add ThemePreset interface that was missing
export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  colors: TourThemeColors;
  transitions?: {
    duration: number;
    easing: string;
  };
  responsive?: {
    mobile?: Partial<TourThemeColors>;
    tablet?: Partial<TourThemeColors>;
    desktop?: Partial<TourThemeColors>;
  };
  previewUrl?: string;
}

// Add ThemeRegistry interface for the theme-registry service
export interface ThemeRegistry {
  getThemes(): ThemePreset[];
  getTheme(id: string): ThemePreset | undefined;
  addTheme(theme: ThemePreset): void;
  removeTheme(id: string): boolean;
  addEventListener(event: string, callback: (theme: ThemePreset) => void): void;
  removeEventListener(event: string, callback: (theme: ThemePreset) => void): void;
}

export const DEFAULT_THEME: TourThemeOptions = {
  name: "default",
  colors: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    background: "#ffffff",
    text: "#1f2937",
    border: "#e5e7eb",
    accent: "#3b82f6"
  },
  borderRadius: "0.5rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  typography: {
    fontFamily: "inherit",
    fontSize: "1rem",
    lineHeight: "1.5"
  },
  animations: {
    duration: "300ms",
    easing: "ease-in-out"
  }
};
