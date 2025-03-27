# Theming and Internationalization (i18n) Guide

## Table of Contents
- [Theming](#theming)
  - [Theme Configuration](#theme-configuration)
  - [Custom Themes](#custom-themes)
  - [Responsive Theming](#responsive-theming)
- [Internationalization (i18n)](#internationalization-i18n)
  - [Setting Up Translations](#setting-up-translations)
  - [Using Translations](#using-translations)
  - [Language Switching](#language-switching)
  - [Testing Translations](#testing-translations)

## Theming

Our application uses a combination of Tailwind CSS and CSS variables for theming. This allows for consistent styling across components while enabling easy customization.

### Theme Configuration

The base theme is defined in `src/styles/themes.ts` and consists of the following key components:

- **Colors**: Primary, secondary, accent, neutral, success, warning, error
- **Typography**: Font families, sizes, weights
- **Spacing**: Standard spacing values
- **Borders**: Border radiuses, widths
- **Shadows**: Box shadow variants
- **Transitions**: Standard transition timings

Example usage:

```tsx
// Using theme colors in a component
<button className="bg-primary hover:bg-primary-dark text-primary-foreground">
  Click Me
</button>
```

### Custom Themes

To create a custom theme, extend the base theme:

1. Create a new theme file in `src/styles/themes/`
2. Import and extend the base theme
3. Register the theme in `src/providers/theme-provider.tsx`

Example custom theme:

```tsx
// src/styles/themes/dark-theme.ts
import { baseTheme } from '../base-theme';

export const darkTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: '#3B82F6',
    background: '#121212',
    foreground: '#F8FAFC',
  }
};
```

### Responsive Theming

For responsive theme variations:

1. Use CSS media queries for breakpoint-specific theming
2. Utilize the `useMediaQuery` hook for conditional theming in components

```tsx
// Using responsive theming
import { useMediaQuery } from '@/hooks/use-media-query';

const Component = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div className={isDesktop ? 'p-6' : 'p-4'}>
      {/* Content */}
    </div>
  );
};
```

## Internationalization (i18n)

Our application uses `react-i18next` for internationalization. This enables multi-language support throughout the application.

### Setting Up Translations

Translation files are located in `public/locales/{lang}/translation.json`. Each language has its own folder with translation files.

Example structure:
```
public/
  locales/
    en/
      translation.json
    es/
      translation.json
    fr/
      translation.json
```

Example translation file:
```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Log in",
    "signup": "Sign up"
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address"
  }
}
```

### Using Translations

To use translations in your components:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

For translations with variables:

```tsx
// Translation: "Hello, {{name}}!"
t('greeting', { name: 'John' }) // "Hello, John!"
```

### Language Switching

Use the `LanguageSelector` component to allow users to switch languages:

```tsx
import { LanguageSelector } from '@/components/language/LanguageSelector';

const Header = () => {
  return (
    <header>
      {/* Other header content */}
      <LanguageSelector />
    </header>
  );
};
```

### Testing Translations

For testing internationalization:

1. Use the `i18next-mock` library in test files
2. Set up a test helper for rendering components with i18n context
3. Assert that correct translations are rendered based on the current language

Example test:

```tsx
import { render, screen } from '@/utils/test-utils';
import { setLanguage } from '@/utils/i18n-test-helper';
import WelcomeMessage from './WelcomeMessage';

describe('WelcomeMessage', () => {
  it('renders greeting in English', () => {
    setLanguage('en');
    render(<WelcomeMessage />);
    expect(screen.getByText('Welcome to our app')).toBeInTheDocument();
  });
  
  it('renders greeting in Spanish', () => {
    setLanguage('es');
    render(<WelcomeMessage />);
    expect(screen.getByText('Bienvenido a nuestra aplicación')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Text Extraction**: Extract all user-facing text into translation files
2. **Namespacing**: Use namespaces to organize translations logically
3. **Placeholder Consistency**: Maintain consistent naming for variables
4. **Right-to-Left Support**: Add RTL support for languages like Arabic
5. **Dates & Numbers**: Use i18n formatting for dates, numbers, and currencies
6. **Lang Attribute**: Ensure `lang` attribute is updated when language changes
7. **Content Expansion**: Accommodate text that may be longer in other languages

## Additional Resources

- [React-i18next Documentation](https://react.i18next.com/)
- [Tailwind CSS Theme Configuration](https://tailwindcss.com/docs/theme)
- [MDN Internationalization Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
