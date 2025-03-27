# Accessibility Implementation Guide

## Focus Management System

### Architecture and Configuration
- Component-based focus management system
- Configurable focus behaviors per component
- Focus trap implementation for modals and dialogs
- Focus restoration patterns after interactions

#### Implementation Example
```tsx
// FocusTrapExample.tsx
import React, { useRef, useEffect } from 'react';

const FocusTrap: React.FC<{ 
  isActive: boolean; 
  children: React.ReactNode;
  returnFocusOnDeactivate?: boolean;
}> = ({ isActive, children, returnFocusOnDeactivate = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    
    // Store currently focused element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Get all focusable elements in the container
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements && focusableElements.length > 0) {
      // Focus the first element
      focusableElements[0].focus();
    }
    
    // Handle tabbing to keep focus within the container
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      // If shift+tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } 
      // If tab on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      
      // Restore focus when trap is deactivated
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, returnFocusOnDeactivate]);
  
  return (
    <div ref={containerRef} className={isActive ? 'focus-trap-active' : ''}>
      {children}
    </div>
  );
};

export default FocusTrap;
```

### Keyboard Navigation
- Comprehensive keyboard shortcuts
- Visual indicators for keyboard focus
- Tab order optimization
- Skip navigation patterns

#### Implementation Example
```tsx
// SkipNavigation.tsx
import React from 'react';

export const SkipNavigation: React.FC = () => {
  return (
    <div className="skip-navigation">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      <a 
        href="#footer" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-44 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to footer
      </a>
    </div>
  );
};

// KeyboardShortcutsManager.tsx
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const keyMatches = event.key === shortcut.key;
        const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey : true;
        const altMatches = shortcut.altKey ? event.altKey : true;
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : true;
        
        if (keyMatches && ctrlMatches && altMatches && shiftMatches) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
  
  // Return function to display available shortcuts
  return {
    getShortcutsHelp: () => shortcuts.map(s => ({
      key: `${s.ctrlKey ? 'Ctrl+' : ''}${s.altKey ? 'Alt+' : ''}${s.shiftKey ? 'Shift+' : ''}${s.key}`,
      description: s.description
    }))
  };
};
```

### Screen Reader Optimization
- ARIA live region management
- Context-aware announcements
- Descriptive element labeling
- Status updates via aria-live

#### Implementation Example
```tsx
// LiveAnnouncer.tsx
import React, { useState, useEffect } from 'react';

interface LiveAnnouncerProps {
  messages: {
    polite: string[];
    assertive: string[];
  };
  clearTimeout?: number;
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({ 
  messages, 
  clearTimeout = 5000 
}) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  
  useEffect(() => {
    if (messages.polite.length > 0) {
      const latestMessage = messages.polite[messages.polite.length - 1];
      setPoliteMessage(latestMessage);
      
      const timer = setTimeout(() => {
        setPoliteMessage('');
      }, clearTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [messages.polite, clearTimeout]);
  
  useEffect(() => {
    if (messages.assertive.length > 0) {
      const latestMessage = messages.assertive[messages.assertive.length - 1];
      setAssertiveMessage(latestMessage);
      
      const timer = setTimeout(() => {
        setAssertiveMessage('');
      }, clearTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [messages.assertive, clearTimeout]);
  
  return (
    <>
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        data-testid="live-announcer-polite"
      >
        {politeMessage}
      </div>
      <div 
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
        data-testid="live-announcer-assertive"
      >
        {assertiveMessage}
      </div>
    </>
  );
};

// Example usage with a custom hook
export const useScreenReaderAnnouncer = () => {
  const [messages, setMessages] = useState<{
    polite: string[];
    assertive: string[];
  }>({
    polite: [],
    assertive: []
  });
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessages(prev => ({
      ...prev,
      [priority]: [...prev[priority], message]
    }));
  };
  
  return {
    announce,
    messages
  };
};
```

### RTL Language Support
- Bi-directional text handling
- Mirrored layouts for RTL languages
- Directionally-aware focus management
- Cultural considerations in interactions

#### Implementation Example
```tsx
// RTLProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';

interface RTLContextType {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  toggleDirection: () => void;
}

const defaultContext: RTLContextType = {
  isRTL: false,
  direction: 'ltr',
  toggleDirection: () => {}
};

const RTLContext = createContext<RTLContextType>(defaultContext);

export const useRTL = () => useContext(RTLContext);

interface RTLProviderProps {
  children: React.ReactNode;
  defaultDirection?: 'ltr' | 'rtl';
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ 
  children, 
  defaultDirection = 'ltr' 
}) => {
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>(defaultDirection);
  
  useEffect(() => {
    // Set the direction attribute on the document
    document.documentElement.setAttribute('dir', direction);
    
    // Add RTL class to body if needed
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Announce direction change to screen readers
    const announcer = document.getElementById('direction-announcer');
    if (announcer) {
      announcer.textContent = `Direction changed to ${direction === 'rtl' ? 'right to left' : 'left to right'}`;
    }
  }, [direction]);
  
  const toggleDirection = () => {
    setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');
  };
  
  const value = {
    isRTL: direction === 'rtl',
    direction,
    toggleDirection
  };
  
  return (
    <RTLContext.Provider value={value}>
      {/* Hidden announcer for screen readers */}
      <div id="direction-announcer" className="sr-only" aria-live="polite"></div>
      {children}
    </RTLContext.Provider>
  );
};

// DirectionalComponent.tsx - Example of a component that adjusts based on direction
export const DirectionalComponent: React.FC = () => {
  const { isRTL } = useRTL();
  
  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="sidebar">Sidebar content</div>
      <div className="main-content">Main content</div>
    </div>
  );
};
```

### Visual Focus Indicators
- Enhanced focus rings
- High-contrast focus states
- Animated focus transitions
- Custom focus styles per component

#### Implementation Example
```css
/* focus-styles.css */

/* Base focus styles */
:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Enhanced keyboard focus styles */
:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.3);
  transition: outline-color 0.2s ease, box-shadow 0.2s ease;
}

/* Higher contrast focus styles for inputs */
input:focus-visible, 
textarea:focus-visible, 
select:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 1px;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4);
}

/* Custom focus styles for buttons */
button:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  transform: scale(1.02);
  transition: outline-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
}

/* High contrast mode support */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText !important;
    outline-offset: 3px !important;
  }
}
```

```tsx
// FocusHighlight.tsx
import React, { useRef, useState, useEffect } from 'react';

interface FocusHighlightProps {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  offset?: number;
  borderRadius?: number;
  animationDuration?: number;
}

export const FocusHighlight: React.FC<FocusHighlightProps> = ({
  children,
  color = '#4f46e5',
  thickness = 2,
  offset = 2,
  borderRadius = 4,
  animationDuration = 200
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const handleFocusIn = () => setHasFocus(true);
    const handleFocusOut = () => setHasFocus(false);
    
    focusableElements.forEach(el => {
      el.addEventListener('focusin', handleFocusIn);
      el.addEventListener('focusout', handleFocusOut);
    });
    
    return () => {
      focusableElements.forEach(el => {
        el.removeEventListener('focusin', handleFocusIn);
        el.removeEventListener('focusout', handleFocusOut);
      });
    };
  }, []);
  
  const highlightStyle = {
    position: 'absolute' as const,
    top: -offset,
    left: -offset,
    right: -offset,
    bottom: -offset,
    borderRadius: borderRadius,
    border: `${thickness}px solid ${color}`,
    boxShadow: `0 0 8px rgba(79, 70, 229, 0.4)`,
    opacity: hasFocus ? 1 : 0,
    pointerEvents: 'none' as const,
    transition: `opacity ${animationDuration}ms ease`,
    zIndex: 10
  };
  
  return (
    <div ref={containerRef} className="relative">
      <div style={highlightStyle} aria-hidden="true" />
      {children}
    </div>
  );
};
```

### Preference Management
- User-configurable accessibility settings
- Persistent accessibility preferences
- Default accessibility profiles
- Automatic detection of system preferences

#### Implementation Example
```tsx
// AccessibilityPreferences.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'normal' | 'large' | 'x-large';
type ColorScheme = 'default' | 'high-contrast' | 'dark' | 'light';
type MotionPreference = 'no-preference' | 'reduced';
type TextSpacing = 'normal' | 'wide';

interface AccessibilityPreferences {
  fontSize: FontSize;
  colorScheme: ColorScheme;
  motionPreference: MotionPreference;
  textSpacing: TextSpacing;
  enableKeyboardFocus: boolean;
  enableScreenReaderHints: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: 'normal',
  colorScheme: 'default',
  motionPreference: 'no-preference',
  textSpacing: 'normal',
  enableKeyboardFocus: true,
  enableScreenReaderHints: true
};

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K, 
    value: AccessibilityPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {},
  resetPreferences: () => {}
});

export const useAccessibilityPreferences = () => useContext(AccessibilityContext);

const STORAGE_KEY = 'accessibility_preferences';

export const AccessibilityProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error);
      return defaultPreferences;
    }
  });
  
  // Detect system preferences on mount
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setPreferences(prev => ({...prev, motionPreference: 'reduced'}));
    }
    
    // Check for color scheme preference
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersColorScheme.matches) {
      setPreferences(prev => ({...prev, colorScheme: 'dark'}));
    }
    
    // Listen for changes to system preferences
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev, 
        motionPreference: e.matches ? 'reduced' : 'no-preference'
      }));
    };
    
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev, 
        colorScheme: e.matches ? 'dark' : 'light'
      }));
    };
    
    prefersReducedMotion.addEventListener('change', handleMotionChange);
    prefersColorScheme.addEventListener('change', handleColorSchemeChange);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
      prefersColorScheme.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);
  
  // Apply preferences to document
  useEffect(() => {
    // Apply font size
    document.documentElement.dataset.fontSize = preferences.fontSize;
    
    // Apply color scheme
    document.documentElement.dataset.colorScheme = preferences.colorScheme;
    
    // Apply motion preference
    document.documentElement.dataset.motion = preferences.motionPreference;
    
    // Apply text spacing
    document.documentElement.dataset.textSpacing = preferences.textSpacing;
    
    // Apply keyboard focus
    if (preferences.enableKeyboardFocus) {
      document.documentElement.classList.add('keyboard-focus-enabled');
    } else {
      document.documentElement.classList.remove('keyboard-focus-enabled');
    }
    
    // Store in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error);
    }
  }, [preferences]);
  
  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K, 
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({...prev, [key]: value}));
  };
  
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };
  
  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// AccessibilitySettingsPanel.tsx - UI for managing accessibility settings
export const AccessibilitySettingsPanel: React.FC = () => {
  const { preferences, updatePreference, resetPreferences } = useAccessibilityPreferences();
  
  return (
    <div className="accessibility-settings-panel p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Accessibility Settings</h2>
      
      <div className="mb-4">
        <label htmlFor="fontSize" className="block mb-2 font-medium">Font Size</label>
        <select 
          id="fontSize"
          value={preferences.fontSize}
          onChange={(e) => updatePreference('fontSize', e.target.value as FontSize)}
          className="w-full p-2 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="x-large">Extra Large</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="colorScheme" className="block mb-2 font-medium">Color Scheme</label>
        <select 
          id="colorScheme"
          value={preferences.colorScheme}
          onChange={(e) => updatePreference('colorScheme', e.target.value as ColorScheme)}
          className="w-full p-2 border rounded"
        >
          <option value="default">Default</option>
          <option value="high-contrast">High Contrast</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="motion" className="block mb-2 font-medium">Motion</label>
        <select 
          id="motion"
          value={preferences.motionPreference}
          onChange={(e) => updatePreference('motionPreference', e.target.value as MotionPreference)}
          className="w-full p-2 border rounded"
        >
          <option value="no-preference">All Animations</option>
          <option value="reduced">Reduced Motion</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="textSpacing" className="block mb-2 font-medium">Text Spacing</label>
        <select 
          id="textSpacing"
          value={preferences.textSpacing}
          onChange={(e) => updatePreference('textSpacing', e.target.value as TextSpacing)}
          className="w-full p-2 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input 
            type="checkbox"
            checked={preferences.enableKeyboardFocus}
            onChange={(e) => updatePreference('enableKeyboardFocus', e.target.checked)}
            className="mr-2"
          />
          <span>Enhanced Keyboard Focus Indicators</span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input 
            type="checkbox"
            checked={preferences.enableScreenReaderHints}
            onChange={(e) => updatePreference('enableScreenReaderHints', e.target.checked)}
            className="mr-2"
          />
          <span>Additional Screen Reader Hints</span>
        </label>
      </div>
      
      <button 
        onClick={resetPreferences}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Reset to Defaults
      </button>
    </div>
  );
};
```

## Best Practices for Implementation

1. **Always use semantic HTML** - Use the right elements for the right purpose (buttons for actions, links for navigation, etc.)

2. **Ensure keyboard accessibility** - All interactive elements must be accessible via keyboard

3. **Provide alternative text** - All non-decorative images should have meaningful alt text

4. **Use ARIA attributes judiciously** - Only use ARIA when HTML semantics alone are insufficient

5. **Test with screen readers** - Regular testing with screen readers like NVDA, JAWS, and VoiceOver

6. **Implement skip links** - Allow keyboard users to bypass navigation menus

7. **Maintain sufficient color contrast** - Meet WCAG AA standard (4.5:1 for normal text, 3:1 for large text)

8. **Support text resizing** - Ensure the layout doesn't break when text is enlarged

9. **Provide clear focus indicators** - Visual feedback for keyboard navigation

10. **Create reusable accessibility components** - Build a library of accessible UI patterns

## Testing and Validation Resources

1. **Automated tools**:
   - axe DevTools
   - WAVE Web Accessibility Evaluation Tool
   - Lighthouse

2. **Manual testing checklists**:
   - Keyboard navigation testing
   - Screen reader testing with multiple devices
   - Color contrast verification

3. **Documentation**:
   - [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/)
   - [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
   - [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

4. **User testing**:
   - Conduct testing with users who rely on assistive technology
   - Collect feedback from users with various accessibility needs
