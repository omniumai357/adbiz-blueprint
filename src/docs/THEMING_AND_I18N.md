
# Theming and Internationalization

This document provides guidance on using and extending the theming and internationalization (i18n) capabilities of the application.

## Theming

### CSS Variable System

The application uses CSS variables for consistent theming across components. These are defined in the root styles and can be modified for custom themes.

#### Core Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  
  /* Tour-specific variables */
  --tour-tooltip-bg: 0 0% 100%;
  --tour-tooltip-text: 240 10% 3.9%;
  --tour-tooltip-border: 240 5.9% 90%;
  --tour-tooltip-accent: 221 83% 53%;
  --tour-tooltip-accent-hover: 217 91% 60%;
  --tour-tooltip-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### Creating Custom Themes

To create a custom theme:

1. Define a new CSS class with overridden variables
2. Apply the class to a container element

Example:

```css
.theme-purple {
  --primary: 270 70% 50%;
  --primary-foreground: 0 0% 100%;
  --accent: 270 60% 96%;
  --accent-foreground: 270 70% 50%;
  --ring: 270 70% 50%;
}
```

### Applying Themes

Themes can be applied programmatically:

```tsx
import { useEffect } from 'react';

function ThemeApplier({ theme = 'default' }) {
  useEffect(() => {
    if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    return () => {
      document.documentElement.classList.remove(
        "theme-blue",
        "theme-purple", 
        "theme-green",
        "theme-amber"
      );
    };
  }, [theme]);
  
  return null;
}
```

## Internationalization (i18n)

The application uses `react-i18next` for internationalization.

### Structure

- Translations are stored in JSON files under `src/i18n/locales/[language code]/`
- Each feature has its own translation file (e.g., `auth.json`, `common.json`)

### Adding New Translations

1. Add new keys to existing translation files
2. Ensure keys are added to all supported languages

Example (`src/i18n/locales/en/auth.json`):

```json
{
  "signIn": "Sign In",
  "signUp": "Sign Up",
  "email": "Email",
  "password": "Password",
  "confirmPassword": "Confirm Password"
}
```

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

function AuthComponent() {
  const { t } = useTranslation('auth');
  
  return (
    <div>
      <h2>{t('signIn')}</h2>
      <label>{t('email')}</label>
      <input type="email" />
      <label>{t('password')}</label>
      <input type="password" />
    </div>
  );
}
```

### RTL Support

The application supports right-to-left (RTL) languages:

1. Language context provides `isRTL` and `direction` properties
2. These are used to conditionally apply RTL-specific styles
3. Components that need directional awareness accept `isRTL` and `direction` props

Example:

```tsx
import { useLanguage } from '@/contexts/language-context';

function DirectionalComponent() {
  const { isRTL, direction } = useLanguage();
  
  return (
    <div dir={direction} className={isRTL ? 'rtl-specific-class' : ''}>
      {/* Component content */}
    </div>
  );
}
```

### Adding a New Language

1. Create a new folder under `src/i18n/locales/` with the language code
2. Copy all translation files from an existing language
3. Translate all values (keep the keys the same)
4. Add the language to the supported languages list in `src/i18n/index.ts`
5. Update the language detection configuration if needed
