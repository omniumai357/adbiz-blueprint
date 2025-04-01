
# Visual Testing Guide

## Introduction

This guide outlines the visual regression testing framework implemented for AdBiz.pro. Visual regression testing helps ensure that UI changes don't inadvertently affect the appearance of components across various device sizes and configurations.

## Visual Testing Framework

Our visual regression testing framework uses Jest, Puppeteer, and jest-image-snapshot to capture and compare screenshots of components and pages across various breakpoints.

### Key Components

1. **Snapshot Generation**: Automated capture of component screenshots
2. **Comparison Algorithm**: Pixel-by-pixel comparison with configurable thresholds
3. **Diff Visualization**: Visual highlighting of differences between baseline and current state
4. **CI/CD Integration**: Automated testing in the deployment pipeline

## Test Coverage Areas

- Core UI Components
- Responsive Layouts
- Theme Variations
- Interactive States
- Animation Sequences
- Device-Specific Rendering
- RTL Language Support

## Running Visual Tests

### Local Environment Setup

```bash
# Install dependencies
npm install

# Run visual tests
npm run test:visual

# Update snapshots (when changes are expected)
npm run test:visual -- -u
```

### Configuring Tests

Visual tests are configured in the `jest.visual.config.js` file. Key configuration options include:

- Viewport sizes for testing
- Comparison thresholds
- Custom selectors for component testing
- Animation stabilization settings
- Browser configurations

## Writing Visual Tests

### Component Test Example

```typescript
describe('Button Component', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/test/button');
  });

  it('should render primary button correctly', async () => {
    await page.waitForSelector('.button-primary');
    const image = await page.screenshot({
      clip: await page.$eval('.button-primary', el => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      }),
    });
    expect(image).toMatchImageSnapshot();
  });

  // Additional tests for different states, sizes, etc.
});
```

### Page-Level Test Example

```typescript
describe('Checkout Page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/checkout');
    await page.waitForSelector('.checkout-container');
  });

  it('should render correctly on desktop', async () => {
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(500); // Allow animations to complete
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

  it('should render correctly on mobile', async () => {
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
```

## CI/CD Integration

Visual tests are integrated into our CI/CD pipeline using GitHub Actions. The workflow is defined in `.github/workflows/visual-regression.yml`.

Key workflow steps:

1. Set up environment
2. Install dependencies
3. Build application
4. Serve application locally
5. Run visual tests
6. Upload diff artifacts on failure
7. Fail build if visual regressions are detected

## Troubleshooting

### Common Issues

- **False Positives**: Minor pixel differences can be addressed by adjusting the failure threshold
- **Animation Interference**: Add appropriate delays or disable animations during testing
- **Cross-Platform Differences**: Use Docker to ensure consistent rendering environment
- **Font Rendering Issues**: Pre-load fonts or use font-display: swap

### Resolving Differences

When a visual test fails, you can:

1. Verify if the change is intentional
2. Update the baseline if the change is expected (`npm run test:visual -- -u`)
3. Fix the code if the change is unintentional

## Best Practices

1. Keep tests focused on specific components or areas
2. Test at key breakpoints that represent device categories
3. Include tests for different themes and states
4. Use explicit waits for asynchronous UI changes
5. Maintain a balance between coverage and execution time
6. Use descriptive test names that indicate what's being tested
7. Group related tests logically
8. Avoid testing highly dynamic content without mocking

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Puppeteer API](https://pptr.dev/)
- [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot)
- [Visual Regression Testing Tutorial](https://www.testim.io/blog/visual-regression-testing/)
