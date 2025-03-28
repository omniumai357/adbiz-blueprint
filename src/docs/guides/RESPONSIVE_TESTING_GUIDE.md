
# Responsive Testing Guide

This guide outlines our approach to testing responsive components in the AdBiz application, covering both visual regression testing and functional testing across different viewport sizes.

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Framework](#testing-framework)
3. [Testing Components](#testing-components)
4. [Device Testing Matrix](#device-testing-matrix)
5. [Best Practices](#best-practices)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

## Introduction

Responsive testing ensures our application functions and appears correctly across all device sizes. Our approach combines:

- **Visual regression testing**: Capturing and comparing screenshots at different breakpoints
- **Functional testing**: Verifying component behavior and interactions at different viewport sizes
- **Accessibility testing**: Ensuring usability across devices and input methods

## Testing Framework

### Standard Breakpoints

We test at the following standard breakpoints (aligned with our design system):

| Breakpoint | Width Range | Description |
|------------|-------------|-------------|
| `xs`       | < 640px     | Mobile phones (portrait) |
| `sm`       | 640-767px   | Mobile phones (landscape) / small tablets |
| `md`       | 768-1023px  | Tablets / small laptops |
| `lg`       | 1024-1279px | Laptops / desktops |
| `xl`       | 1280-1535px | Large desktops |
| `xxl`      | ≥ 1536px    | Extra large displays |

### Testing Priority

Not all components need testing at every breakpoint. We prioritize based on usage:

- **Priority breakpoints** (`xs`, `md`, `xl`): Test all components at these breakpoints
- **Secondary breakpoints** (`sm`, `lg`, `xxl`): Test complex components or when specific behavior differs

### Testing Utilities

Our framework provides these key utilities:

- **`ResponsiveTestWrapper`**: Container for testing components at specific viewport sizes
- **`testAllBreakpoints`**: Helper for running tests across multiple breakpoints
- **`getViewportForBreakpoint`**: Maps breakpoint names to viewport dimensions
- **`createResponsiveVisualTests`**: Creates a set of visual tests across breakpoints

## Testing Components

### Visual Regression Testing

Visual tests capture and compare component appearance across breakpoints:

```tsx
// Example visual test
createResponsiveVisualTests(
  'ComponentName',
  (breakpoint) => (
    <ResponsiveTestWrapper breakpoint={breakpoint}>
      <YourComponent {...props} />
    </ResponsiveTestWrapper>
  ),
  ['xs', 'md', 'xl'] // breakpoints to test
);
```

### Functional Testing

Test component behavior at different viewport sizes:

```tsx
// Example functional test
test('component shows compact view on mobile', () => {
  render(
    <ResponsiveTestWrapper breakpoint="xs">
      <YourComponent />
    </ResponsiveTestWrapper>
  );
  
  // Test mobile-specific behavior
  expect(screen.getByTestId('compact-view')).toBeVisible();
});
```

## Device Testing Matrix

We prioritize testing on real devices based on this matrix:

| Priority | Description | Device Examples |
|----------|-------------|-----------------|
| P0       | Critical - must test | iPhone SE, Galaxy S21, iPad, 1080p laptop |
| P1       | High - should test | iPhone Pro Max, iPad Pro, laptop (1440p) |
| P2       | Medium - periodically test | Galaxy tablets, ultrawide monitors |
| P3       | Low - as resources allow | Older devices, unusual aspect ratios |

For a complete list, see our [Device Testing Matrix](../DEVICE_TESTING_MATRIX.md).

## Best Practices

1. **Mobile-first testing**
   - Start testing with the smallest viewport (`xs`)
   - Then progress to larger viewports
   - Check transition points between breakpoints

2. **State variations**
   - Test each key state (default, loading, error, etc.) at priority breakpoints
   - Test critical states at all breakpoints

3. **Testing efficiency**
   - Use `createResponsiveVisualTests` for basic appearance tests
   - Use `testAllBreakpoints` for more complex test scenarios
   - For non-visual tests, focus on breakpoints where behavior changes

4. **Regression prevention**
   - Update snapshots only when UI changes are intentional
   - Document expected responsive behavior in component documentation
   - Include responsive tests in CI pipeline

## Examples

### Basic Visual Test

```tsx
// Test component appearance across breakpoints
createResponsiveVisualTests(
  'MilestoneCard',
  (breakpoint) => (
    <ResponsiveTestWrapper breakpoint={breakpoint}>
      <MilestoneCard 
        name="Test Milestone" 
        currentPoints={50}
        pointsRequired={100}
      />
    </ResponsiveTestWrapper>
  )
);
```

### Testing Different States

```tsx
// Test empty state at mobile breakpoint
test('shows empty state correctly on mobile', () => {
  render(
    <ResponsiveTestWrapper breakpoint="xs">
      <MilestonesList milestones={[]} />
    </ResponsiveTestWrapper>
  );
  
  expect(screen.getByText('No milestones yet')).toBeVisible();
});
```

### Testing Responsive Behavior

```tsx
// Test responsive layout behavior
testAllBreakpoints(
  'adjusts layout based on viewport',
  ['xs', 'md', 'xl'],
  (breakpoint) => {
    render(
      <ResponsiveTestWrapper breakpoint={breakpoint}>
        <Dashboard />
      </ResponsiveTestWrapper>
    );
    
    if (breakpoint === 'xs') {
      expect(screen.getByTestId('stacked-layout')).toBeInTheDocument();
    } else {
      expect(screen.getByTestId('grid-layout')).toBeInTheDocument();
    }
  }
);
```

## Troubleshooting

### Common Issues

1. **Inconsistent snapshot failures**
   - Ensure tests run with consistent font loading
   - Check for animations that may cause inconsistencies
   - Use `waitForAnimations()` before capturing snapshots

2. **Different results across environments**
   - Use containerized testing in CI
   - Set consistent viewport sizes
   - Mock browser features consistently

3. **Test taking too long**
   - Limit breakpoints to priority ones (xs, md, xl)
   - Group similar test cases
   - Use selective component testing rather than full page

For more detailed guidance, see the [Component Testing Template](./COMPONENT_TESTING_TEMPLATE.md).

