# Theming Guide

## Table of Contents
- [Overview](#overview)
- [Theme Configuration](#theme-configuration)
- [Using the Theme](#using-the-theme)
- [Customizing Themes](#customizing-themes)
- [Theme Switching](#theme-switching)
- [Color Tokens](#color-tokens)
- [Responsive Theming](#responsive-theming)
- [Component Variants](#component-variants)
- [Best Practices](#best-practices)

## Overview

Our application uses a combination of Tailwind CSS and CSS variables for theming. This approach provides:

- Consistent styling across components
- Easy customization and theme switching
- Support for light and dark modes
- Responsive design adaptations

## Theme Configuration

Themes are defined in the following structure:

```
src/styles/
  ├── themes/
  │   ├── index.ts       # Exports all themes
  │   ├── default.ts     # Default theme
  │   ├── dark.ts        # Dark theme
  │   └── ...            # Custom themes
  └── theme-variables.css # CSS variables
```

A theme defines colors, typography, spacing, and other design tokens:

```ts
// Example theme structure
export const defaultTheme = {
  colors: {
    primary: {
      DEFAULT: '#3B82F6',
      foreground: '#FFFFFF',
      50: '#EFF6FF',
      // ... other shades
    },
    // ... other color categories
  },
  fonts: {
    sans: '"Inter", sans-serif',
    // ... other font families
  },
  // ... other design tokens
};
```

## Using the Theme

### With Tailwind Classes

The most common way to use the theme is via Tailwind classes:

```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary-600">
  Click Me
</button>
```

### With CSS Variables

For more complex styling needs, access theme values via CSS variables:

```css
.custom-element {
  background-color: var(--colors-primary);
  color: var(--colors-primary-foreground);
  border-radius: var(--radius-md);
}
```

## Customizing Themes

### Creating a New Theme

To create a custom theme:

1. Create a new theme file in `src/styles/themes/`
2. Extend the base theme with your custom values
3. Register your theme in the theme provider

```ts
// src/styles/themes/custom-theme.ts
import { defaultTheme } from './default';

export const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: {
      DEFAULT: '#8B5CF6', // Purple instead of blue
      foreground: '#FFFFFF',
      // ... other shades
    },
  },
};
```

### Component-specific Theming

For components that need specific theming:

```tsx
import { cn } from '@/lib/utils';

type ButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  // ... other props
};

export function Button({ 
  variant = 'default',
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "rounded font-medium transition-colors",
        // Variant-specific styles
        variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary-600",
        variant === 'outline' && "border border-input bg-background hover:bg-accent",
        variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
        // Custom classes
        className
      )}
      {...props}
    />
  );
}
```

## Theme Switching

The application supports theme switching via the `useTheme` hook:

```tsx
import { useTheme } from '@/hooks/useTheme';

function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  
  return (
    <select 
      value={theme} 
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}
```

## Color Tokens

Our theme uses a consistent color token system:

| Token | Purpose |
|-------|---------|
| `primary` | Main brand color |
| `secondary` | Secondary brand color |
| `accent` | Highlight color for UI elements |
| `background` | Page background |
| `foreground` | Text on background |
| `card` | Card background |
| `card-foreground` | Text on card |
| `muted` | Subdued background |
| `muted-foreground` | Subdued text |
| `destructive` | Error states |
| `success` | Success states |
| `warning` | Warning states |
| `info` | Informational states |

Each color also has variants from 50-950 for different intensities (e.g., `primary-50`, `primary-100`).

## Responsive Theming

For responsive theme adaptations:

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

function ResponsiveComponent() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div className={isDesktop ? 'p-6' : 'p-4'}>
      {/* Content */}
    </div>
  );
}
```

## Component Variants

Many UI components support variants for different appearances:

```tsx
// Button with different variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Card with different variants
<Card variant="default">Default Card</Card>
<Card variant="bordered">Bordered Card</Card>
```

## Best Practices

1. **Use Tailwind classes** whenever possible for consistency
2. **Follow the color token system** rather than using arbitrary colors
3. **Create component variants** instead of one-off styles
4. **Support both light and dark modes** for all components
5. **Test designs at different breakpoints** for responsive behavior
6. **Extend existing themes** rather than creating entirely new ones
7. **Document custom theme tokens** for other developers
8. **Use semantic color names** in components (e.g., `primary` not `blue`)
9. **Use CSS variables for animation durations** to maintain consistency
10. **Keep themes maintainable** by organizing them clearly
