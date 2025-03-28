
---
name: Visual Regression Test Failure
about: Report a visual regression test failure
title: '[Visual Regression] Component name - failure description'
labels: 'visual-testing, bug'
assignees: ''
---

## Failed Component

<!-- Name of the component that failed visual regression testing -->

## Test Case

<!-- Describe the specific test case that failed (e.g., "Button in hover state at mobile breakpoint") -->

## PR/Commit

<!-- Link to the PR or commit that triggered the failure -->

## Failure Details

<!-- Include details about the failure from CI logs -->

## Diff Image

<!-- If available, attach or link to the diff image from CI artifacts -->

## Expected Behavior

<!-- Describe how the component should look -->

## Actual Behavior

<!-- Describe how the component actually looks in the failed test -->

## Possible Causes

<!-- List any potential causes for the regression -->

## Action Items

- [ ] Review diff images
- [ ] Determine if change is intentional or a regression
- [ ] If intentional, update baselines
- [ ] If regression, fix the component
- [ ] Re-run tests to confirm resolution
