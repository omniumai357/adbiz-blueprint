
# Device Testing Matrix for Rewards System

This document outlines the structured approach for testing the Rewards system across different devices, browsers, and operating systems to ensure consistent responsive behavior.

## Testing Priorities

| Priority | Description |
|----------|-------------|
| **P0**   | Must test before any release - critical paths |
| **P1**   | Should test before major releases |
| **P2**   | Periodically test during development cycles |
| **P3**   | Test as resources allow |

## Device Categories & Testing Combinations

### Mobile Phones

| Device                | Screen Size | OS                | Browser           | Priority |
|-----------------------|-------------|-------------------|-------------------|----------|
| iPhone SE / iPhone 8  | 375×667     | iOS 15+           | Safari            | P0       |
| iPhone 13 / 14        | 390×844     | iOS 16+           | Safari            | P0       |
| iPhone 13/14 Pro Max  | 428×926     | iOS 16+           | Safari            | P1       |
| Samsung Galaxy S21    | 360×800     | Android 12+       | Chrome            | P0       |
| Google Pixel 6        | 393×851     | Android 12+       | Chrome            | P1       |
| Samsung Galaxy S22 Ultra | 412×915  | Android 12+       | Chrome, Samsung   | P2       |

### Tablets

| Device                | Screen Size | OS                | Browser           | Priority |
|-----------------------|-------------|-------------------|-------------------|----------|
| iPad (9th gen)        | 768×1024    | iPadOS 15+        | Safari            | P0       |
| iPad Air              | 820×1180    | iPadOS 15+        | Safari            | P1       |
| iPad Pro 12.9"        | 1024×1366   | iPadOS 15+        | Safari            | P2       |
| Samsung Tab S7        | 800×1280    | Android 12+       | Chrome            | P1       |

### Laptops & Desktops

| Device Type           | Screen Size | OS                | Browser           | Priority |
|-----------------------|-------------|-------------------|-------------------|----------|
| Small Laptop          | 1366×768    | Windows 11        | Chrome, Edge      | P0       |
| Standard Laptop       | 1440×900    | macOS             | Chrome, Safari    | P0       |
| Large Laptop          | 1680×1050   | macOS, Windows    | Chrome, Safari, Firefox | P1  |
| Desktop               | 1920×1080   | Windows 11        | Chrome, Edge, Firefox | P1  |
| Large Desktop         | 2560×1440   | macOS, Windows    | Chrome            | P2       |
| Ultra-Wide Monitor    | 3440×1440   | Windows           | Chrome            | P3       |

## Browser Testing Matrix

| Browser           | Versions to Test   | OS Combinations                    | Priority |
|-------------------|--------------------|------------------------------------|----------|
| Chrome            | Latest, Latest-1   | Windows, macOS, Android            | P0       |
| Safari            | Latest, Latest-1   | iOS, iPadOS, macOS                 | P0       |
| Firefox           | Latest             | Windows, macOS                      | P1       |
| Edge              | Latest             | Windows                             | P1       |
| Samsung Internet  | Latest             | Android                             | P2       |

## Device Orientation Testing

For mobile and tablet devices, test both portrait and landscape orientations, with special attention to:

- Milestone cards layout changes
- Progress visualization visibility
- Touch target sizes in both orientations
- Header and footer positioning

## Specific Feature Testing Points

### 1. MilestoneProgressCard

| Feature                      | Test Devices                       | Priority |
|------------------------------|-----------------------------------|----------|
| Stats visibility on small screens | iPhone SE, Galaxy S21         | P0       |
| Compact mode rendering       | All mobile devices                | P0       |
| Icon scaling                 | All devices                       | P1       |
| Text truncation              | All devices                       | P1       |

### 2. RewardCard

| Feature                      | Test Devices                       | Priority |
|------------------------------|-----------------------------------|----------|
| Touch target size for buttons | All mobile devices                | P0       |
| Text truncation              | iPhone SE, Galaxy S21             | P0       |
| Badge visibility             | All devices                       | P1       |
| Card layout in grid          | Tablets and desktop               | P1       |

### 3. MilestoneCard

| Feature                      | Test Devices                       | Priority |
|------------------------------|-----------------------------------|----------|
| Progress visualization       | All devices                       | P0       |
| Button sizing on mobile      | iPhone SE, Galaxy S21             | P0       |
| Description truncation       | All mobile devices                | P1       |
| Completion state visibility  | All devices                       | P1       |

### 4. MilestonesDashboard

| Feature                      | Test Devices                       | Priority |
|------------------------------|-----------------------------------|----------|
| Grid layout transitions      | All devices, especially at breakpoints | P0   |
| Section ordering             | All devices                       | P0       |
| Empty state rendering        | All devices                       | P1       |
| Available rewards section    | Tablet and mobile                 | P1       |

## Testing Protocol

1. **High-Priority Devices (P0)**:
   - Test before every release
   - Complete test for all features
   - Test orientation changes

2. **Medium-Priority Devices (P1)**:
   - Test before major releases
   - Focus on core features

3. **Lower-Priority Devices (P2-P3)**:
   - Periodic testing
   - Spot check for major issues

## Results Recording

For each test session, record:
1. Date of testing
2. Device and browser combinations tested
3. Issues found (with screenshots)
4. Components affected
5. Breakpoints where issues occur

## Testing Resources

### Tools for Testing
- Browser DevTools (Chrome, Firefox, Safari)
- BrowserStack for device testing
- Responsively App for quick multi-device preview
- Chrome Device Mode

### Test Data
Use standard test data sets with varying content lengths:
- Short milestone names/descriptions
- Long milestone names/descriptions
- No milestone description
- Various progress percentages (0%, 25%, 50%, 99%, 100%)

## Testing Schedule

P0 devices should be tested:
- After any UI component changes
- Before each release
- Weekly during active development

P1 devices should be tested:
- Before major releases
- Bi-weekly during active development

P2-P3 devices should be tested:
- Monthly during active development
- Before major version releases
