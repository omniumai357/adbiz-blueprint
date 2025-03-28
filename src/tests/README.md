
# Testing Guidelines

This document provides an overview of our testing strategy, with a focus on visual regression testing.

## Types of Tests

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components
- **Visual Regression Tests**: Ensure UI components render consistently over time
- **End-to-End Tests**: Test complete user flows through the application

## Visual Regression Testing

### Purpose

Visual regression tests capture screenshots of UI components and compare them against baseline images to detect unintended visual changes.

### Structure

- Tests are located in `src/tests/visual/`
- Each test file follows the naming pattern `ComponentName.visual.test.tsx`
- Baseline images are stored in `src/tests/__image_snapshots__/`

### Running Tests

```bash
# Run all visual tests
npm run test:visual

# Update baselines (when design changes are intentional)
npm run test:visual:update

# Test a specific component
npm run test:visual:component ComponentName
```

### Creating New Visual Tests

1. Create a new file in `src/tests/visual/` named `YourComponent.visual.test.tsx`
2. Import the component and testing utilities
3. Write test cases that render the component in different states and at different breakpoints
4. Run the tests to create initial baseline images

Example:

```tsx
import React from 'react';
import { render } from '@testing-library/react';
import YourComponent from '@/components/YourComponent';
import { 
  testAllBreakpoints,
  getSnapshotIdentifier
} from './visualRegressionSetup';
import ResponsiveVisualTest from './components/ResponsiveVisualTest';

describe('YourComponent Visual Tests', () => {
  testAllBreakpoints(
    'renders correctly at different breakpoints',
    ['xs', 'md', 'xl'],
    (breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <YourComponent prop1="value1" prop2="value2" />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: getSnapshotIdentifier(
          'YourComponent', 
          breakpoint
        )
      });
    }
  );
});
```

### CI/CD Integration

Visual tests run automatically on pull requests and pushes to main branches. Failed tests will upload diff images as artifacts for review.

See [CI Visual Testing Documentation](../docs/CI_VISUAL_TESTING.md) for more details.

### Best Practices

1. Test all major breakpoints (at minimum: xs, md, xl)
2. Test all significant component states (default, hover, active, error, etc.)
3. Mock dynamic content to ensure consistent snapshots
4. Keep tests focused on single components or small component groups
5. Use descriptive test names and snapshot identifiers
