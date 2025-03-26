
# Tour Theme System

The tour theme system provides a flexible way to customize the appearance of tour components to match your application's design language.

## Basic Usage

```typescript
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';

function MyComponent() {
  const { setTheme, currentTheme, availableThemes } = useTourTheme();
  
  // Change theme
  const handleThemeChange = (themeId) => {
    setTheme(themeId);
  };
  
  return (
    <div>
      <h2>Current theme: {currentTheme}</h2>
      
      <div>
        {availableThemes.map(theme => (
          <button 
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Built-in Themes

The tour system comes with several built-in themes:

- `default` - Standard tour theme with blue accents
- `blue` - Cool blue theme with ocean-inspired colors
- `purple` - Rich purple theme with vibrant accents
- `green` - Fresh green theme with natural feel
- `amber` - Warm amber theme with autumn colors
- `corporate` - Professional theme for business applications
- `minimal` - Clean and minimalist design
- `playful` - Fun and colorful theme with rounded elements

## Custom Themes

You can create custom themes to perfectly match your application's design:

```typescript
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';

function ThemeCustomizer() {
  const { setCustomThemeColors } = useTourTheme();
  
  const applyBrandTheme = () => {
    setCustomThemeColors({
      // Colors
      accentBlue: '#FF5733',         // Primary accent color
      accentPurple: '#9733FF',       // Secondary accent color
      accentGreen: '#33FF57',        // Success color
      accentRed: '#FF3333',          // Error color
      accentAmber: '#FFAA33',        // Warning color
      
      // Backgrounds
      bgPrimary: '#FFFFFF',          // Primary background
      bgSecondary: '#F8F8F8',        // Secondary background
      
      // Text
      textPrimary: '#333333',        // Primary text color
      textSecondary: '#666666',      // Secondary text color
      
      // Borders
      borderPrimary: '#EEEEEE',      // Primary border color
      borderHighlight: '#FF5733',    // Highlight border color
      
      // Visual properties
      borderRadius: '0.75rem',       // Border radius for components
      shadow: '0 4px 8px rgba(0,0,0,0.1)' // Shadow for tooltips
    }, 'Brand Theme');
  };
  
  return (
    <button onClick={applyBrandTheme}>Apply Brand Theme</button>
  );
}
```

## Theme Transitions

You can control the animation when switching between themes:

```typescript
const { setTheme } = useTourTheme();

// Apply theme with custom transition
setTheme('purple', {
  duration: 500,  // Transition duration in ms
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // CSS easing function
});
```

## Registering Custom Themes

You can register custom themes for reuse:

```typescript
import { useTourTheme } from '@/lib/tour/hooks/useTourTheme';
import { createCustomTheme } from '@/lib/tour/services/theme-registry';

function ThemeManager() {
  const { registerTheme, unregisterTheme } = useTourTheme();
  
  const addCorporateTheme = () => {
    const corporateTheme = createCustomTheme(
      'enterprise',
      'Enterprise',
      {
        accentBlue: '#0057B8',
        accentPurple: '#5D5D9E',
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F6F9FC',
        textPrimary: '#252631',
        textSecondary: '#545D7A',
        borderPrimary: '#E2E8F0',
        borderHighlight: '#0057B8',
        borderRadius: '0.25rem',
        shadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      },
      {
        description: 'Enterprise-ready theme for professional applications',
        transitions: {
          duration: 200,
          easing: 'ease-out'
        }
      }
    );
    
    registerTheme(corporateTheme);
  };
  
  return (
    <div>
      <button onClick={addCorporateTheme}>Add Enterprise Theme</button>
      <button onClick={() => unregisterTheme('enterprise')}>Remove Enterprise Theme</button>
    </div>
  );
}
```

## Dark Mode Integration

The tour theme system automatically integrates with dark mode when your application uses the `.dark` class:

```css
/* Dark mode is automatically applied when the .dark class is present */
.dark {
  /* Tour theme variables are adjusted automatically */
}
```

## Responsive Considerations

The theme system includes responsive adjustments for different viewport sizes:

- Mobile (< 640px): Adjusted spacing and border radius
- Specific theme properties can be tweaked per viewport in custom themes

## Guidelines

When implementing custom themes, consider these best practices:

1. **Consistency**: Maintain consistency with your application's overall design language
2. **Contrast**: Ensure sufficient contrast for accessibility 
3. **Transitions**: Use smooth transitions between themes
4. **Testing**: Test themes on both light and dark backgrounds
5. **Accessibility**: Verify that custom themes meet accessibility standards
