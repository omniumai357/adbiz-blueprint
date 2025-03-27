
# Internationalization (i18n) Guide

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Translation Files](#translation-files)
- [Using Translations](#using-translations)
- [Switching Languages](#switching-languages)
- [Right-to-Left (RTL) Support](#right-to-left-rtl-support)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Overview

Our application uses `react-i18next` and `i18next` for internationalization. This allows us to:

- Support multiple languages throughout the application
- Switch languages dynamically without page reload
- Handle RTL languages like Arabic and Hebrew
- Format dates, numbers, and currencies according to locale
- Provide localized content for screen readers

## Setup

The i18n system is configured in `src/i18n/index.ts`. Key features include:

- Namespace support for organizing translations by feature
- Dynamic loading of translation files
- Language detection from browser, localStorage, and URL
- Fallback to English when translations are missing

## Translation Files

Translation files are located in `src/i18n/locales/{lang}/{namespace}.json`:

```
src/i18n/locales/
  ├── en/
  │   ├── common.json
  │   ├── auth.json
  │   ├── rewards.json
  │   └── ...
  ├── es/
  │   ├── common.json
  │   ├── auth.json
  │   └── ...
  └── fr/
      ├── common.json
      ├── auth.json
      └── ...
```

Each translation file contains key-value pairs:

```json
{
  "welcome": "Welcome to our app",
  "buttons": {
    "login": "Log in",
    "signup": "Sign up"
  }
}
```

## Using Translations

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('buttons.login')}</button>
    </div>
  );
}
```

### With Variables

```tsx
// In translation file: "greeting": "Hello, {{name}}!"
t('greeting', { name: 'John' }) // "Hello, John!"
```

### Pluralization

```tsx
// In translation file: 
// "items": "{{count}} item",
// "items_plural": "{{count}} items"
t('items', { count: 1 }) // "1 item"
t('items', { count: 5 }) // "5 items"
```

### Using Namespaces

```tsx
// Load specific namespace
const { t } = useTranslation('auth');

// Use translation from specific namespace
t('login.title'); // From auth namespace

// Use translation from another namespace
t('common:buttons.submit'); // From common namespace
```

## Switching Languages

Use the `LanguageSelector` component or the `useLanguage` hook:

```tsx
import { useLanguage } from '@/contexts/language';

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  
  return (
    <select 
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name} ({lang.nativeName})
        </option>
      ))}
    </select>
  );
}
```

## Right-to-Left (RTL) Support

RTL languages (Arabic, Hebrew) are automatically detected and the following changes occur:

1. The `dir="rtl"` attribute is added to the HTML element
2. The `rtl` class is added to the body
3. CSS logical properties are utilized (e.g., `margin-inline-start` instead of `margin-left`)

Custom RTL styles can be added using the `[dir="rtl"]` selector:

```css
.sidebar {
  left: 0;
}

[dir="rtl"] .sidebar {
  left: auto;
  right: 0;
}
```

## Accessibility

For screen reader support:

- The `lang` attribute is updated when the language changes
- Language changes are announced to screen readers
- The `useLanguageA11y` hook provides utilities for managing language-specific accessibility attributes

```tsx
import { useLanguageA11y } from '@/hooks/useLanguageA11y';

function AccessibleContent() {
  const { applyLanguageAttributes } = useLanguageA11y();
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      applyLanguageAttributes(contentRef.current);
    }
  }, [applyLanguageAttributes]);
  
  return <div ref={contentRef} data-i18n-section>...</div>;
}
```

## Testing

For testing internationalized components:

```tsx
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/test-utils';
import MyComponent from './MyComponent';

// Set language for test
i18n.changeLanguage('en');

test('displays correct translation', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  
  expect(screen.getByText('Welcome to our app')).toBeInTheDocument();
});
```

## Best Practices

1. **Use namespaces** to organize translations by feature
2. **Extract all user-facing text** into translation files
3. **Use placeholders** for dynamic content
4. **Support pluralization** for numeric content
5. **Consider text expansion** - some languages require more space
6. **Test with RTL languages** to ensure layout works correctly
7. **Format dates and numbers** according to locale
8. **Avoid concatenation** - use placeholders instead
9. **Document language requirements** for content creators
