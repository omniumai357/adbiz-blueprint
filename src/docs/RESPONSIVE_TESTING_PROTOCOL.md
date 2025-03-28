
# Responsive Testing Protocol for Rewards System

This document outlines the structured approach for testing responsive design implementation across the Rewards system components. It provides guidelines, checklists, and methodologies to ensure consistent user experience across all devices and screen sizes.

## 1. Breakpoint Definitions

Our system uses the following standard breakpoints:

| Breakpoint | Width Range           | Device Category                  |
|------------|----------------------|----------------------------------|
| `xs`       | < 640px              | Mobile (Portrait)                |
| `sm`       | 640px - 767px        | Mobile (Landscape)               |
| `md`       | 768px - 1023px       | Tablets                          |
| `lg`       | 1024px - 1279px      | Small Laptops / Desktops         |
| `xl`       | 1280px - 1535px      | Desktops / Large Laptops         |
| `xxl`      | ≥ 1536px             | Large Displays                   |

## 2. Component Testing Checklist

### 2.1 Global Layout Components

#### Container Component
- [ ] Proper padding/margins at all breakpoints
- [ ] Content stays within bounds without horizontal scrolling
- [ ] Appropriate max-width constrains based on breakpoint
- [ ] Correct spacing between siblings

#### Rewards Page
- [ ] Header scales appropriately across breakpoints
- [ ] Main content area maintains readable width
- [ ] Proper spacing between sections at all sizes
- [ ] Footer remains properly aligned

### 2.2 Feature Components

#### MilestonesDashboard
- [ ] Grid layout properly adapts:
  - 1 column on mobile
  - 2 columns on tablets
  - 3 columns on desktops where appropriate
- [ ] Section ordering prioritizes important information at each breakpoint
- [ ] Available rewards properly display at different sizes
- [ ] Empty states are clearly visible and properly sized

#### MilestoneProgressCard
- [ ] All metrics remain visible or are sensibly condensed on smaller screens
- [ ] Icons scale appropriately for each breakpoint
- [ ] Text remains legible at all sizes
- [ ] Card padding adjusts for screen size

#### RewardCard
- [ ] Text properly truncates on smaller screens
- [ ] Discount badge remains prominent but doesn't overflow
- [ ] Call-to-action button has appropriate touch target size (≥44px)
- [ ] Card spacing adjusts for screen size while maintaining visual hierarchy

#### MilestoneCard
- [ ] Progress visualization scales appropriately
- [ ] Description text truncates at appropriate breakpoints
- [ ] Progress information remains clear on small screens
- [ ] CTA button has proper touch target size
- [ ] Completed/claimed states are visually distinguishable at all sizes

## 3. Testing Methodology

### 3.1 Manual Testing Process

1. **Browser Development Tools**
   - Use Chrome/Firefox/Safari DevTools responsive mode
   - Test at each defined breakpoint
   - Test intermediate sizes to ensure smooth transitions
   - Verify orientation changes using device emulation

2. **Testing Sequence**
   - Start with the smallest breakpoint (xs)
   - Progress through each larger breakpoint
   - Note any visual inconsistencies or interaction issues
   - Test backwards from largest to smallest to catch regression issues

3. **Interactive Testing**
   - Verify all interactive elements are accessible
   - Test touch interactions on touch-enabled devices
   - Verify keyboard navigation works appropriately
   - Check focus states are visible at all breakpoints

### 3.2 Automated Visual Tests

We use Jest with React Testing Library and jest-image-snapshot for automated visual regression testing.

Sample test script structure:
```javascript
describe('MilestoneCard responsive rendering', () => {
  const breakpoints = [
    { width: 375, height: 667, name: 'xs' },
    { width: 768, height: 1024, name: 'md' },
    { width: 1440, height: 900, name: 'xl' }
  ];

  breakpoints.forEach(({width, height, name}) => {
    it(`renders correctly at ${name} breakpoint`, async () => {
      // Set viewport
      await page.setViewport({ width, height });
      
      // Render component
      await page.goto('/rewards');
      
      // Take screenshot
      const image = await page.screenshot();
      
      // Compare with baseline
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: `milestone-card-${name}`
      });
    });
  });
});
```

## 4. Device Testing Matrix

### 4.1 Priority Device Combinations

| Device Category | Example Devices | Browsers | Priority |
|-----------------|----------------|----------|----------|
| Mobile Small    | iPhone SE, Samsung Galaxy S10e | Safari, Chrome | High |
| Mobile Medium   | iPhone 13, Pixel 6 | Safari, Chrome | High |
| Mobile Large    | iPhone 13 Pro Max, Samsung S22 Ultra | Safari, Chrome | Medium |
| Tablet          | iPad 10.2", iPad Air, Samsung Tab S7 | Safari, Chrome | High |
| Tablet Large    | iPad Pro 12.9" | Safari | Medium |
| Laptop          | 13" display (1366×768) | Chrome, Firefox, Edge | High |
| Desktop         | 24" display (1920×1080) | Chrome, Firefox, Edge | High |
| Large Display   | 27"+ display (2560×1440 or higher) | Chrome | Medium |

### 4.2 Browser Coverage

| Browser | Versions | Platforms |
|---------|----------|-----------|
| Chrome  | Latest, Latest-1 | Windows, macOS, Android |
| Safari  | Latest, Latest-1 | iOS, macOS |
| Firefox | Latest | Windows, macOS |
| Edge    | Latest | Windows |

## 5. Testing Schedule and Process

### 5.1 Testing Triggers

- Major UI changes to reward components
- Changes to responsive hooks or utilities
- Weekly scheduled review of responsive behavior
- Before each release

### 5.2 Issue Reporting

When reporting responsive issues:

1. Specify the device/browser/OS combination
2. Include screenshots or screen recordings
3. Provide steps to reproduce
4. Note the breakpoint where the issue occurs
5. Reference the specific component affected

### 5.3 Common Responsive Issues to Watch For

- Text overflow or truncation issues
- Touch targets too small or overlapping on mobile
- Content requiring horizontal scrolling
- Elements not aligning properly at breakpoints
- Inconsistent spacing at different breakpoints
- Unreadable text due to size or contrast issues
- Interactive elements not working properly on touch devices

## 6. Implementation Checklist for Developers

When implementing or modifying components:

- [ ] Use relative units (rem, em, %) instead of fixed pixels for sizing
- [ ] Implement mobile-first design approach
- [ ] Test components at each breakpoint during development
- [ ] Ensure text remains readable at all sizes (min. 16px body, 14px secondary)
- [ ] Validate touch targets meet accessibility standards (≥44px)
- [ ] Use Tailwind's responsive modifiers consistently
- [ ] Leverage the `useResponsive()` hook for complex conditional rendering
- [ ] Add appropriate aria attributes for accessibility

## 7. Tools and Resources

### 7.1 Development Tools

- Browser DevTools (Chrome, Firefox, Safari)
- Browser extensions for responsive testing
- Device emulators

### 7.2 Testing Utilities

- Jest for automated testing
- React Testing Library for component testing
- jest-image-snapshot for visual regression testing

## 8. Continuous Improvement

This testing protocol should be reviewed quarterly and updated based on:
- New device releases
- Browser updates
- Changes to design system
- Feedback from user testing
- New responsive design patterns

## Appendix A: useResponsive Hook Reference

The `useResponsive` hook provides the following values:

```typescript
{
  // Direct breakpoint checks
  isXs: boolean,  // < 640px
  isSm: boolean,  // 640px - 767px
  isMd: boolean,  // 768px - 1023px
  isLg: boolean,  // 1024px - 1279px
  isXl: boolean,  // 1280px - 1535px
  isXxl: boolean, // ≥ 1536px
  
  // Composite helpers
  isMobile: boolean,     // < 768px
  isTablet: boolean,     // 768px - 1023px
  isDesktop: boolean,    // ≥ 1024px
  isLargeDesktop: boolean, // ≥ 1280px
  
  // Orientation
  isLandscape: boolean,
  isPortrait: boolean,
  
  // Device capabilities
  hasTouchSupport: boolean,
  
  // Meta information
  activeBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  
  // Comparison helpers
  atLeast: {
    sm: boolean, // ≥ 640px
    md: boolean, // ≥ 768px
    lg: boolean, // ≥ 1024px
    xl: boolean, // ≥ 1280px
    xxl: boolean // ≥ 1536px
  },
  
  atMost: {
    xs: boolean, // < 640px
    sm: boolean, // < 768px
    md: boolean, // < 1024px
    lg: boolean, // < 1280px
    xl: boolean  // < 1536px
  }
}
```

## Appendix B: Visual Regression Test Example

```javascript
import { render } from '@testing-library/react';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import MilestoneCard from '../components/rewards/MilestoneCard';

expect.extend({ toMatchImageSnapshot });

describe('MilestoneCard Responsive Tests', () => {
  // Define standard test prop set
  const standardProps = {
    name: 'First Purchase',
    description: 'Complete your first purchase',
    icon: 'shopping-cart',
    pointsRequired: 100,
    currentPoints: 50,
    isCompleted: false,
    rewardClaimed: false,
  };
  
  // Define breakpoints to test
  const breakpoints = [
    { width: 375, label: 'mobile' },
    { width: 768, label: 'tablet' },
    { width: 1280, label: 'desktop' }
  ];
  
  // Test each breakpoint
  breakpoints.forEach(({width, label}) => {
    it(`renders correctly at ${label} breakpoint`, () => {
      // Mock window size
      window.innerWidth = width;
      window.innerHeight = 800;
      
      // Render component
      const { container } = render(<MilestoneCard {...standardProps} />);
      
      // Take snapshot
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: `milestone-card-${label}`
      });
    });
  });
  
  // Additional test cases for different states
  it('renders completed state correctly on mobile', () => {
    window.innerWidth = 375;
    const { container } = render(
      <MilestoneCard 
        {...standardProps} 
        isCompleted={true} 
      />
    );
    expect(container).toMatchImageSnapshot({
      customSnapshotIdentifier: 'milestone-card-mobile-completed'
    });
  });
});
```
