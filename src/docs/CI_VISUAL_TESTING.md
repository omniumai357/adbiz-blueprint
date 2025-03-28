
# Visual Regression Testing CI/CD Integration

This document outlines how visual regression tests are integrated into our CI/CD pipeline.

## Overview

Visual regression tests ensure that UI components render consistently across code changes. The tests capture screenshots of components and compare them against baseline images to detect unintended visual changes.

## CI/CD Integration

Our visual tests run automatically on:
- All pushes to `main` and `develop` branches that modify components or tests
- All pull requests targeting `main` or `develop` branches

### GitHub Actions Workflow

The workflow is defined in `.github/workflows/visual-regression.yml` and performs the following steps:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies
4. Creates baseline snapshots if none exist
5. Runs visual regression tests
6. Uploads diff images as artifacts if tests fail

## Running Tests Locally

Before pushing changes, you should run visual tests locally:

```bash
# Run all visual tests
npm run test:visual

# Update baselines (use with caution)
npm run test:visual:update

# Test a specific component
npm run test:visual:component ComponentName
```

## Managing Baselines

Baseline images are stored in the `src/tests/__image_snapshots__` directory. When design changes are intentional, baselines need to be updated:

1. Make UI component changes
2. Run `npm run test:visual:update` to update baselines
3. Commit both the code changes and the updated snapshots

## Handling Failures

When visual tests fail in CI:

1. GitHub Actions will upload the diff images as artifacts
2. Review the diffs to determine if the changes are intentional
3. If intentional, update baselines locally and push again
4. If unintentional, fix the UI issues and push again

## Best Practices

1. **Keep tests focused**: Test one component variation per test case
2. **Responsive testing**: Always test components across multiple breakpoints
3. **Minimal dependencies**: Avoid tests that depend on external services
4. **Deterministic rendering**: Ensure consistent font rendering, date formats, etc.
5. **Review snapshots**: When reviewing PRs, also review snapshot changes

## Troubleshooting

### Common Issues

1. **Inconsistent rendering across environments**:
   - Use consistent fonts across testing environments
   - Mock dynamic content like dates/times
   - Consider OS-specific baselines for font rendering differences

2. **Flaky tests**:
   - Ensure animations complete before capturing
   - Mock random/dynamic data
   - Use `waitForAnimations()` utility

3. **Test timeouts**:
   - Increase timeout for complex components
   - Optimize component rendering performance
