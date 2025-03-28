
# Visual Reference Library

This document explains how to use and maintain the Visual Reference Library for our design system.

## Overview

The Visual Reference Library is a comprehensive collection of screenshots for each component at all breakpoints and states. It serves as a visual reference for developers and designers to ensure consistent responsive behavior across the application.

## Directory Structure

The Visual Reference Library is organized as follows:

```
docs/visual-reference-library/
├── index.html               # Main entry point with interactive viewer
├── ComponentA/              # Directory for each component
│   ├── ComponentA-xs-default.png
│   ├── ComponentA-xs-hover.png
│   ├── ComponentA-sm-default.png
│   └── ...
├── ComponentB/
│   └── ...
└── ...
```

## Generating the Library

The Visual Reference Library can be generated using the provided script:

```bash
# Ensure the development server is running on port 5173
npm run dev

# In a separate terminal, run the generator
npx ts-node src/tests/scripts/generate-visual-reference.ts
```

This will:
1. Launch a headless browser
2. Visit each component at different breakpoints and states
3. Capture screenshots
4. Generate an HTML index for easy browsing

## Viewing the Library

After generation, you can view the library by opening the generated HTML file:

```bash
open docs/visual-reference-library/index.html
```

The viewer provides:
- Tabs for different breakpoints
- Grid layout of components
- State variations for interactive components
- Responsive metadata

## When to Update

The Visual Reference Library should be updated:

1. When adding new components
2. After making significant visual changes to existing components
3. Before major releases
4. When responsive behavior specifications change
5. When adding support for new breakpoints

## Adding New Components

To add a new component to the library:

1. Add the component name to the `COMPONENTS_TO_CAPTURE` array in the generator script
2. Ensure the component is properly implemented in the `ComponentPreviewPage.tsx` file
3. Re-run the generator script

## Using as a Reference

The Visual Reference Library serves several purposes:

1. **Documentation**: It provides a visual documentation of the design system's responsive behavior
2. **Testing**: It serves as a reference for manual and automated visual testing
3. **Design Consistency**: It helps maintain consistency across the application
4. **Communication**: It facilitates communication between developers and designers

## Best Practices

- Compare actual implementation against the reference library during code review
- Use the library when discussing responsive behavior with designers
- Update the library when making intentional visual changes
- Refer to the library when implementing new components to maintain consistency
