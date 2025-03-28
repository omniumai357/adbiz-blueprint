
# Building Responsive Components

This guide provides best practices for creating responsive components in the AdBiz application.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Responsive Hooks](#responsive-hooks)
3. [Component Patterns](#component-patterns)
4. [Testing Responsive Components](#testing-responsive-components)
5. [Common Pitfalls](#common-pitfalls)

## Core Principles

### Mobile-First Design

Always start by designing for mobile devices, then progressively enhance for larger screens:

```tsx
// Mobile-first approach
const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {isMobile ? (
        <MobileView />
      ) : isTablet ? (
        <TabletView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
};
```

### Content Adaptability

Content should adapt to different screen sizes in these ways:

1. **Reflow**: Content shifts to accommodate screen size
2. **Reformat**: Content presentation changes (e.g., list vs. grid)
3. **Reorganize**: Content priority changes
4. **Reduce**: Less important content is hidden on smaller screens

### Touch Optimization

Ensure all interactive elements are touch-friendly:

- Minimum 44×44px touch targets
- Appropriate spacing between clickable elements
- Clear visual feedback for interactive elements

## Responsive Hooks

Our application provides several hooks for responsive design:

### useResponsive

The primary hook for responsive decisions:

```tsx
const { 
  // Device type
  isMobile, isTablet, isDesktop,
  
  // Orientation
  isPortrait, isLandscape,
  
  // Screen dimensions
  screenWidth, screenHeight,
  
  // Current breakpoint
  activeBreakpoint,
  
  // Helpers
  atLeast, atMost
} = useResponsive();
```

### useDevice

For more detailed device information:

```tsx
const {
  // Device capabilities
  hasTouchCapability,
  highDPI,
  
  // Raw dimensions
  dimensions,
  pixelRatio
} = useDevice();
```

### useMediaQuery

For custom media queries:

```tsx
const isPrint = useMediaQuery('print');
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
```

## Component Patterns

### Responsive View Components

Create specialized view components for different device types:

```tsx
// Component with responsive views
const UserProfile = () => {
  const { preferredViewMode } = useResponsive();
  
  switch (preferredViewMode) {
    case 'compact':
      return <UserProfileCompact />;
    case 'drawer':
      return <UserProfileDrawer />;
    default:
      return <UserProfileStandard />;
  }
};
```

### Responsive Layout Components

Use layout components that adapt to different screen sizes:

```tsx
const ResponsiveGrid = ({ children, minWidth = 250 }) => (
  <div 
    style={{ 
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      gap: '1rem'
    }}
  >
    {children}
  </div>
);
```

### Responsive Context

Use context providers to share responsive state across components:

```tsx
// In a parent component
<ResponsiveProvider>
  <AppLayout>
    <UserDashboard />
  </AppLayout>
</ResponsiveProvider>

// In a child component
const UserDashboard = () => {
  const { isMobile } = useResponsive();
  
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
};
```

## Testing Responsive Components

### Manual Testing

1. Use browser developer tools to test at different viewport sizes
2. Test on actual devices when possible
3. Use device emulators for a wider range of devices
4. Check orientation changes (portrait/landscape)

### Automated Testing

We provide several utilities for testing responsive components:

```tsx
// Test at multiple breakpoints
testAllBreakpoints(
  'renders correctly at different breakpoints',
  ['xs', 'md', 'xl'],
  (breakpoint) => {
    render(
      <ResponsiveTestWrapper breakpoint={breakpoint}>
        <ComponentToTest />
      </ResponsiveTestWrapper>
    );
    
    // Test assertions
  }
);
```

## Common Pitfalls

### Overflowing Content

- Always test with realistic content lengths
- Use text truncation or scrolling containers when needed
- Ensure images scale appropriately

### Touch Target Size

- Buttons and links should be at least 44×44px on touch devices
- Add appropriate padding to increase touch target size

### Performance Issues

- Avoid expensive operations when responding to resize events
- Use throttling or debouncing for resize handlers
- Prefer CSS media queries for simple layout changes

### Layout Shifts

- Avoid layout shifts by using min-height or aspect ratio
- Placeholder content should match the expected dimensions
- Set explicit width/height for images and media

## Resources

- [Responsive Testing Guide](./RESPONSIVE_TESTING_GUIDE.md)
- [Device Testing Matrix](../DEVICE_TESTING_MATRIX.md)
- [CSS Breakpoint Reference](../BREAKPOINT_REFERENCE.md)
