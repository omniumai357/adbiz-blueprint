
# Visual Testing Guide

This guide outlines our approach to visual regression testing in the AdBiz.pro application, including setup instructions, best practices, and guidelines for running and maintaining visual tests.

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Maintaining Tests](#maintaining-tests)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Introduction

Visual regression testing helps us detect unintended visual changes to our UI components. By capturing screenshots of components and comparing them against a baseline, we can identify visual regressions before they reach production.

### Key Benefits

- Early detection of UI regressions
- Consistent user experience across devices and browsers
- Documentation of component appearance at different breakpoints
- Validation of responsive design implementation

## Setup

### Prerequisites

- Node.js 16+
- Jest and jest-image-snapshot
- Access to the project repository

### Initial Configuration

1. The testing framework is already configured in `src/tests/visual/visualRegressionSetup.ts`
2. Test components are located in `src/tests/visual/`
3. Support components for testing are in `src/tests/visual/components/`

## Running Tests

### Basic Usage

To run all visual tests:

```bash
npm run test:visual
```

To test a specific component:

```bash
npm run test:visual MilestoneCard
```

To update snapshots after intentional UI changes:

```bash
npm run test:visual -- -u
```

### Alternative Script Execution

You can also use our custom script for more options:

```bash
node src/tests/scripts/run-visual-tests.js --all
node src/tests/scripts/run-visual-tests.js RewardCard
node src/tests/scripts/run-visual-tests.js --update
```

## Maintaining Tests

### When to Update Snapshots

Update snapshots when:

1. You've made intentional changes to a component's design
2. You've modified the responsive behavior of a component
3. After upgrading UI dependencies that affect component appearance

### When to Add New Tests

Create new visual tests when:

1. Developing new UI components
2. Adding significant variants to existing components
3. Fixing visual bugs (create a test that verifies the fix)

## Best Practices

### Writing Effective Tests

1. **Test multiple breakpoints**: Always test components at xs, md, and xl breakpoints at minimum.
2. **Test all states**: Capture snapshots for all possible component states (loading, error, empty, etc.).
3. **Isolate components**: Test components in isolation to minimize test brittleness.
4. **Mock data consistently**: Use consistent mock data to ensure reproducible tests.
5. **Add meaningful descriptions**: Use clear test names that describe what's being tested.

### Example Test Structure

```tsx
testAllBreakpoints(
  'renders in-progress milestone correctly',
  ['xs', 'md', 'xl'],
  (breakpoint) => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint={breakpoint}>
        <ComponentUnderTest {...props} />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'ComponentName', 
        breakpoint,
        'state-description'
      )
    });
  }
);
```

## Troubleshooting

### Common Issues

1. **Test fails with minimal pixel differences**:
   - Check the diff image to see if differences are noticeable
   - If intentional, update the snapshot
   - If necessary, adjust the failureThreshold in defaultSnapshotOptions

2. **Inconsistent failures across environments**:
   - Ensure fonts are consistent across testing environments
   - Check for environment-specific rendering differences
   - Consider using containerized testing for consistency

3. **Tests failing in CI but passing locally**:
   - Different OS/browsers can render fonts and anti-aliasing differently
   - Consider environment-specific snapshots if needed

### Getting Support

If you encounter issues with visual testing:

1. Check existing issues in the project repository
2. Consult with the QA team
3. Reach out to the development team leads

## Additional Resources

- [Jest Image Snapshot Documentation](https://github.com/americanexpress/jest-image-snapshot)
- [Responsive Testing Protocol](../RESPONSIVE_TESTING_PROTOCOL.md)
- [Component Development Guidelines](../UI_REQUIREMENTS.md)

