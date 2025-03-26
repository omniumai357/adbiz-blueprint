
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
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  accent: string;
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
