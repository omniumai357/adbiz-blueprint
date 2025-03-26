import { ThemePreset, ThemeRegistry, TourThemeColors } from '../types/theme';

/**
 * Default built-in themes
 */
const builtInThemes: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard tour theme with blue accents',
    colors: {
      primary: "#3b82f6",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#1f2937",
      border: "#e5e7eb",
      accent: "#3b82f6",
      accentBlue: '#0ea5e9',
      accentPurple: '#8b5cf6',
      accentGreen: '#10b981',
      accentRed: '#ef4444',
      accentAmber: '#f59e0b',
      borderRadius: '0.5rem',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Cool blue theme with ocean-inspired colors',
    colors: {
      primary: "#0ea5e9",
      secondary: "#60a5fa",
      background: "#ffffff",
      text: "#0f172a",
      border: "#e2e8f0",
      accent: "#0ea5e9",
      accentBlue: '#0ea5e9',
      accentPurple: '#8b5cf6', 
      borderHighlight: '#0ea5e9',
      shadow: '0 4px 12px -2px rgba(14, 165, 233, 0.2)',
      borderRadius: '0.5rem'
    }
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Rich purple theme with vibrant accents',
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      background: "#ffffff",
      text: "#1e1b4b",
      border: "#e9d5ff",
      accent: "#8b5cf6",
      accentBlue: '#8b5cf6',
      accentPurple: '#9333ea',
      borderHighlight: '#8b5cf6',
      shadow: '0 4px 12px -2px rgba(139, 92, 246, 0.2)',
      borderRadius: '0.75rem'
    },
    transitions: {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Fresh green theme with natural feel',
    colors: {
      primary: "#10b981",
      secondary: "#34d399",
      background: "#ffffff",
      text: "#064e3b",
      border: "#d1fae5",
      accent: "#10b981",
      accentBlue: '#10b981',
      accentGreen: '#059669',
      borderHighlight: '#10b981',
      shadow: '0 4px 12px -2px rgba(16, 185, 129, 0.2)',
      borderRadius: '0.5rem'
    }
  },
  {
    id: 'amber',
    name: 'Amber',
    description: 'Warm amber theme with autumn colors',
    colors: {
      primary: "#f59e0b",
      secondary: "#fbbf24",
      background: "#ffffff",
      text: "#78350f",
      border: "#fef3c7",
      accent: "#f59e0b",
      accentBlue: '#f59e0b',
      accentAmber: '#d97706',
      borderHighlight: '#f59e0b',
      shadow: '0 4px 12px -2px rgba(245, 158, 11, 0.2)',
      borderRadius: '0.375rem'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional theme for business applications',
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      background: "#f8fafc",
      text: "#1e293b",
      border: "#e2e8f0",
      accent: "#3b82f6",
      accentBlue: '#3b82f6',
      accentPurple: '#6366f1',
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      borderPrimary: '#e2e8f0',
      borderHighlight: '#3b82f6',
      borderRadius: '0.25rem',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimalist design',
    colors: {
      primary: "#525252",
      secondary: "#737373",
      background: "#ffffff",
      text: "#171717",
      border: "#e5e5e5",
      accent: "#525252",
      accentBlue: '#525252',
      accentPurple: '#737373',
      bgPrimary: '#ffffff',
      bgSecondary: '#fafafa',
      textPrimary: '#171717',
      textSecondary: '#525252',
      borderPrimary: '#e5e5e5',
      borderHighlight: '#525252',
      borderRadius: '0.125rem',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    }
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and colorful theme with rounded elements',
    colors: {
      primary: "#8b5cf6",
      secondary: "#d946ef",
      background: "#ffffff",
      text: "#581c87",
      border: "#e9d5ff",
      accent: "#8b5cf6",
      accentBlue: '#8b5cf6',
      accentPurple: '#d946ef',
      accentGreen: '#34d399',
      accentRed: '#f87171',
      accentAmber: '#fbbf24',
      bgPrimary: '#ffffff',
      bgSecondary: '#faf5ff',
      textPrimary: '#581c87',
      borderPrimary: '#e9d5ff',
      borderHighlight: '#8b5cf6',
      borderRadius: '1rem',
      shadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)'
    },
    transitions: {
      duration: 300,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
];

/**
 * Theme registry implementation for managing tour themes
 */
class ThemeRegistryService implements ThemeRegistry {
  private themes: Map<string, ThemePreset>;
  private eventListeners: Map<string, Array<(theme: ThemePreset) => void>>;
  
  constructor(initialThemes: ThemePreset[] = []) {
    this.themes = new Map();
    this.eventListeners = new Map();
    
    // Register built-in themes
    builtInThemes.forEach(theme => this.addTheme(theme));
    
    // Register additional themes if provided
    initialThemes.forEach(theme => this.addTheme(theme));
  }
  
  /**
   * Get all registered themes
   */
  getThemes(): ThemePreset[] {
    return Array.from(this.themes.values());
  }
  
  /**
   * Get a specific theme by ID
   */
  getTheme(id: string): ThemePreset | undefined {
    return this.themes.get(id);
  }
  
  /**
   * Add a new theme to the registry
   */
  addTheme(theme: ThemePreset): void {
    if (this.themes.has(theme.id)) {
      console.warn(`Theme with ID "${theme.id}" already exists and will be overwritten`);
    }
    
    this.themes.set(theme.id, theme);
    this.notifyListeners('themeAdded', theme);
  }
  
  /**
   * Remove a theme from the registry
   */
  removeTheme(id: string): boolean {
    const theme = this.themes.get(id);
    const result = this.themes.delete(id);
    
    if (result && theme) {
      this.notifyListeners('themeRemoved', theme);
    }
    
    return result;
  }
  
  /**
   * Subscribe to theme registry events
   */
  addEventListener(event: string, callback: (theme: ThemePreset) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event)?.push(callback);
  }
  
  /**
   * Remove an event listener
   */
  removeEventListener(event: string, callback: (theme: ThemePreset) => void): void {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;
    
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
  
  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: string, theme: ThemePreset): void {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;
    
    listeners.forEach(callback => {
      try {
        callback(theme);
      } catch (error) {
        console.error(`Error in theme registry listener for ${event}:`, error);
      }
    });
  }
}

// Export a singleton instance of the theme registry
export const themeRegistry = new ThemeRegistryService();

// Helper function to create a new custom theme
export function createCustomTheme(
  id: string, 
  name: string, 
  colors: Partial<TourThemeColors>, 
  options?: {
    description?: string;
    previewUrl?: string;
    transitions?: {
      duration: number;
      easing: string;
    };
    responsive?: {
      mobile?: Partial<TourThemeColors>;
      tablet?: Partial<TourThemeColors>;
      desktop?: Partial<TourThemeColors>;
    };
  }
): ThemePreset {
  // Ensure all required properties are present
  const defaultColors: TourThemeColors = {
    primary: colors.primary || "#3b82f6",
    secondary: colors.secondary || "#6b7280",
    background: colors.background || "#ffffff",
    text: colors.text || "#1f2937",
    border: colors.border || "#e5e7eb",
    accent: colors.accent || colors.primary || "#3b82f6"
  };

  // Merge with provided colors
  const mergedColors = { ...defaultColors, ...colors };

  return {
    id,
    name,
    colors: mergedColors,
    ...(options || {})
  };
}
