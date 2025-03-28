
# Content Sections Guide

This guide provides comprehensive documentation for our standardized content section components. These components ensure consistent layout, spacing, and responsiveness across the application.

## Table of Contents

1. [Content Section](#content-section)
2. [Content Columns](#content-columns)
3. [Spacing Components](#spacing-components)
4. [Responsive Typography](#responsive-typography)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

## Content Section

The `ContentSection` component provides a standardized container for content sections with consistent padding, spacing, and optional header elements.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | string | - | Optional heading for the section |
| `description` | string | - | Optional description text |
| `variant` | "default" \| "muted" \| "primary" \| "secondary" \| "accent" | "default" | Background style variant |
| `size` | "sm" \| "md" \| "lg" \| "xl" \| "full" | "lg" | Width constraint |
| `padding` | "none" \| "sm" \| "md" \| "lg" \| "xl" | "md" | Padding size |
| `centered` | boolean | false | Whether to center the content |
| `divider` | boolean | false | Whether section has a divider |
| `className` | string | - | Custom class names |
| `headingClassName` | string | - | Class name for the heading |
| `descriptionClassName` | string | - | Class name for the description |
| `contentClassName` | string | - | Class name for the content |

### Example

```tsx
<ContentSection
  heading="Features"
  description="Explore our key features that set us apart"
  variant="muted"
  padding="lg"
  centered
>
  <FeaturesGrid />
</ContentSection>
```

## Content Columns

The `ContentColumns` component provides a responsive two-column layout that adapts to different screen sizes. On mobile, it stacks columns vertically; on larger screens, it displays them side by side with configurable widths.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `left` | ReactNode | required | Left column content |
| `right` | ReactNode | required | Right column content |
| `distribution` | "equal" \| "left-wide" \| "right-wide" \| "custom" | "equal" | Column layout on larger screens |
| `leftWidth` | string | "50%" | Custom width for left column (if distribution is "custom") |
| `rightWidth` | string | "50%" | Custom width for right column (if distribution is "custom") |
| `alignment` | "top" \| "center" \| "bottom" | "top" | Alignment of columns |
| `gap` | "sm" \| "md" \| "lg" \| "xl" | "md" | Spacing between columns |
| `reverseMobile` | boolean | false | Reverse column order on mobile |
| `className` | string | - | Additional class names |
| `leftClassName` | string | - | Left column class names |
| `rightClassName` | string | - | Right column class names |

### Example

```tsx
<ContentColumns
  distribution="left-wide"
  left={<ProductImage />}
  right={<ProductDetails />}
  gap="lg"
  reverseMobile
/>
```

## Spacing Components

### Spacer

The `Spacer` component creates consistent vertical spacing between elements with responsive sizing based on screen size.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "xxl" | "md" | Vertical size of the spacer |
| `visible` | boolean | false | Whether the spacer is visible (with a border) |
| `height` | string \| number | - | Custom height that overrides default spacing |
| `responsive` | boolean | true | Whether to scale the spacer based on screen size |
| `className` | string | - | Custom class names |

#### Example

```tsx
<div>
  <Section1 />
  <Spacer size="lg" />
  <Section2 />
</div>
```

### ContentStack

The `ContentStack` component creates a vertical stack of elements with consistent spacing that adapts to different screen sizes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Content to render within the stack |
| `spacing` | "xs" \| "sm" \| "md" \| "lg" \| "xl" | "md" | Spacing between items |
| `responsive` | boolean | true | Whether to scale spacing based on screen size |
| `className` | string | - | Custom class names |

#### Example

```tsx
<ContentStack spacing="md">
  <Card1 />
  <Card2 />
  <Card3 />
</ContentStack>
```

## Responsive Typography

### ResponsiveHeading

The `ResponsiveHeading` component automatically scales font size based on the current screen size.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | "h2" | The heading level (h1-h6) |
| `children` | ReactNode | required | Heading content |
| `size` | "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" | "xl" | Visual size, can be different from semantic heading level |
| `bold` | boolean | true | Whether the heading should be bold |
| `responsive` | boolean | true | Whether the heading should scale based on screen size |
| `className` | string | - | Custom class names |

#### Example

```tsx
<ResponsiveHeading as="h1" size="4xl">
  Welcome to AdBiz
</ResponsiveHeading>
```

### ResponsiveText

The `ResponsiveText` component automatically adjusts font size based on current screen size.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Text content |
| `size` | "xs" \| "sm" \| "base" \| "lg" \| "xl" | "base" | Text size |
| `muted` | boolean | false | Whether the text is muted (lower contrast) |
| `responsive` | boolean | true | Whether to make the text responsive to screen size |
| `leading` | "tight" \| "normal" \| "relaxed" | "normal" | Leading (line height) configuration |
| `className` | string | - | Custom class names |

#### Example

```tsx
<ResponsiveText size="lg" muted>
  Learn more about our services and how we can help your business grow.
</ResponsiveText>
```

## Usage Examples

### Basic Page Layout

```tsx
<div className="min-h-screen flex flex-col">
  <Header />
  
  <main className="flex-grow">
    {/* Hero Section */}
    <ContentSection padding="none" size="full">
      <Hero />
    </ContentSection>
    
    {/* Features Section */}
    <ContentSection 
      heading="Our Key Features" 
      description="Discover what makes us different"
      padding="xl"
      variant="default"
    >
      <FeaturesGrid />
    </ContentSection>
    
    {/* Two-Column Section */}
    <ContentSection
      heading="About Our Company"
      padding="lg"
      variant="muted"
    >
      <ContentColumns
        distribution="left-wide"
        left={<AboutContent />}
        right={<AboutImage />}
      />
    </ContentSection>
  </main>
  
  <Footer />
</div>
```

### Card Grid Layout

```tsx
<ContentSection
  heading="Our Services"
  description="Explore our comprehensive service offerings"
  padding="lg"
>
  <ResponsiveGrid columns={3} gap="md">
    {services.map(service => (
      <ServiceCard key={service.id} service={service} />
    ))}
  </ResponsiveGrid>
</ContentSection>
```

## Best Practices

1. **Consistent Section Structure**
   - Use `ContentSection` for all major page sections
   - Include heading and description for better semantics and SEO
   - Maintain consistent padding across similar sections

2. **Responsive Behavior**
   - Test layouts at all breakpoints (xs, sm, md, lg, xl, xxl)
   - Use `reverseMobile` when content should appear in different order on mobile
   - Pay attention to text readability on small screens

3. **Spacing Guidelines**
   - Use `Spacer` or `ContentStack` for vertical spacing
   - Maintain consistent spacing rhythm throughout the application
   - Reduce spacing on mobile for efficient use of screen real estate

4. **Typography Hierarchy**
   - Use appropriate heading levels (h1-h6) for semantic structure
   - Choose size based on visual hierarchy, not semantic level
   - Ensure sufficient contrast for text, especially for muted text

5. **Performance Considerations**
   - Avoid deep nesting of responsive components
   - Use responsive images with appropriate sizes for different breakpoints
   - Consider lazy loading for content below the fold
