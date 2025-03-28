
# Component Behavior Specifications

This guide provides detailed specifications for how components should behave across different breakpoints, including animations, transitions, and content adaptation strategies.

## Table of Contents

1. [Introduction](#introduction)
2. [Global Responsive Behaviors](#global-responsive-behaviors)
3. [Component-Specific Behaviors](#component-specific-behaviors)
4. [Animation & Transition Specifications](#animation--transition-specifications)
5. [Content Adaptation Strategies](#content-adaptation-strategies)
6. [Decision Trees](#decision-trees)

## Introduction

This document formalizes the expected responsive behavior of our components, providing a single source of truth for developers and designers. It goes beyond static appearance to specify how components should *behave* when users interact with them across different devices.

## Global Responsive Behaviors

These behaviors apply to all components unless otherwise specified:

### Touch vs. Mouse Interactions

| Input Type | Behavior Modification |
|------------|------------------------|
| Touch      | Increase touch targets to min 44px×44px, add 300ms touch feedback, remove hover states |
| Mouse      | Show hover states, utilize right-click menus, support precise interactions |
| Pen/Stylus | Similar to touch but with more precision, support pressure sensitivity where applicable |

### Focus States

Focus states must be visible across all breakpoints, with these modifications:

- **Mobile**: Larger focus indicators (2px border)
- **Tablet/Desktop**: Standard focus indicators (1px border with glow)

### Loading States

Loading states should be appropriate to the device context:

- **Mobile**: Simplified loaders, smaller spinners, more skeleton screens
- **Desktop**: Can use more elaborate loading indicators

### Error States

Error presentation adapts to available space:

- **Mobile**: Inline errors with minimal text
- **Tablet**: Inline errors with full text 
- **Desktop**: Can use tooltips for additional error context

## Component-Specific Behaviors

### MilestoneCard

| Breakpoint | Layout Changes | Interactive Elements | Content Adaptation |
|------------|----------------|----------------------|-------------------|
| xs (<640px) | Single column, larger progress indicator | Full-width buttons, tap to expand description | Truncate description to 2 lines with ellipsis |
| sm (640-767px) | Single column, medium progress indicator | 80% width buttons, tap to expand description | Truncate description to 3 lines |
| md (768-1023px) | May use 2-column layout | Standard buttons with visible hover state | Show more description text |
| lg+ (≥1024px) | 2 or 3 column layout | Enhanced hover effects, tooltip context | Full description visible |

**State Transitions:**
- Progress animation should complete in 1000ms with ease-out timing
- When claiming a reward, use a celebratory animation (confetti effect)
- Completion state change should have a subtle "pop" effect
- Touch feedback should be immediate with 300ms transition out

**Touch vs. Mouse Behavior:**
- Touch devices should have slightly larger touch targets for buttons
- On hover-capable devices, show additional context on hover
- On touch devices, make milestone name tappable to expand details

### MilestoneProgressCard

| Breakpoint | Layout Changes | Interactive Elements | Content Adaptation |
|------------|----------------|----------------------|-------------------|
| xs (<640px) | Compact view with essentials only | Stats are not interactive | Show only top metrics, hide secondary info |
| sm (640-767px) | Semi-compact with more metrics | Limited interactions | Show key metrics with minimal descriptions |
| md+ (≥768px) | Full layout with all metrics | Stats can link to detailed views | Show all metrics with complete descriptions |

**Animation Behavior:**
- Progress indicators should animate on entry (1200ms ease-out)
- Number counters should increment visibly when values change
- Background gradient should subtly shift based on progress percentage

### RewardCard

| Breakpoint | Layout Changes | Interactive Elements | Content Adaptation |
|------------|----------------|----------------------|-------------------|
| xs (<640px) | Stack elements vertically | Full-width redeem button | Truncate title/description aggressively |
| sm (640-767px) | Compact horizontal layout | Standard button width | Truncate description only |
| md+ (≥768px) | Spacious layout with all elements | Button with hover effects | Full content display |

**State Transitions:**
- Available → Redeemed: 800ms transition with color shift
- Unavailable → Available: Pulse animation when becoming available
- Redemption animation should draw attention (1200ms sequence)

**Accessibility Considerations:**
- Ensure touch targets remain at least 44×44px on mobile
- Maintain 4.5:1 contrast ratio for status text across all sizes
- Reduced motion setting should disable elaborate animations

## Animation & Transition Specifications

### Standard Durations

| Interaction Type | Mobile Duration | Desktop Duration | Easing Function |
|------------------|-----------------|------------------|-----------------|
| Button press     | 150ms           | 100ms            | ease-out        |
| Dialog open      | 300ms           | 250ms            | ease-in-out     |
| State change     | 400ms           | 300ms            | ease            |
| Progress update  | 800ms           | 600ms            | ease-out        |
| Page transition  | 500ms           | 400ms            | cubic-bezier(0.4, 0, 0.2, 1) |

### Reduced Motion Considerations

When a user has requested reduced motion:

1. Replace transitions with immediate or very short (≤100ms) changes
2. Disable background animations completely
3. Use opacity changes instead of movement where possible
4. Eliminate any bounce, elastic, or spring effects

### Conditional Animations

| Condition | Animation Modification |
|-----------|------------------------|
| Low-power mode | Reduce animation complexity, shorten durations by 50% |
| Low-end device (detected via performance.now()) | Use simplified animations, reduce or eliminate particle effects |
| High-end device | Can use more elaborate animations with particle effects |

## Content Adaptation Strategies

### Text Truncation Strategy

1. **Title Text:**
   - xs: Single line with ellipsis after ~20 chars
   - sm: Single line with ellipsis after ~30 chars
   - md+: Full title or 2 lines maximum

2. **Description Text:**
   - xs: 2 lines maximum with ellipsis
   - sm: 3 lines maximum with ellipsis
   - md: 4 lines maximum with ellipsis
   - lg+: Full text or 6 lines maximum

### Image Adaptation

| Breakpoint | Strategy |
|------------|----------|
| xs (<640px) | Smaller, optimized images (max 150px height) |
| sm (640-767px) | Medium images (max 200px height) |
| md (768-1023px) | Standard images with normal resolution |
| lg+ (≥1024px) | High-resolution images when available |

### Layout Adaptations

1. **Card-based Components:**
   - xs: Single column, vertically stacked
   - sm: 1-2 columns depending on complexity
   - md: 2-3 columns
   - lg+: 3-4 columns or grid layout

2. **Information Density:**
   - xs: Essential information only
   - sm: Essential + some secondary information
   - md+: Complete information

## Decision Trees

### Component Display Mode Decision Tree

```
Is viewport < 640px (xs)?
├─ YES → Use compact mode
│         Is performance constrained?
│         ├─ YES → Use ultra-compact mode with minimal animations
│         └─ NO → Use standard compact mode
└─ NO → Is viewport < 1024px (< lg)?
    ├─ YES → Use standard mode
    │         Is high detail important for this component?
    │         ├─ YES → Use standard mode with enhanced content
    │         └─ NO → Use slightly compact mode
    └─ NO → Use expanded mode
            Is screen ≥ 1536px (xxl)?
            ├─ YES → Consider multi-column or dashboard layout
            └─ NO → Use standard expanded mode
```

### Interaction Style Decision Tree

```
Does user have pointer device?
├─ YES → Is it a coarse pointer (touch)?
│         ├─ YES → Use touch-optimized interactions
│         │         Is device orientation portrait?
│         │         ├─ YES → Vertically optimize UI
│         │         └─ NO → Horizontally optimize UI
│         └─ NO → Use mouse-optimized interactions
│                  Offer hover states and smaller targets
└─ NO → Is keyboard navigation primary?
    ├─ YES → Optimize for keyboard with clear focus states
    └─ NO → Assume touch and optimize accordingly
```

### Content Adaptation Decision Tree

```
Is available width < 640px?
├─ YES → Apply aggressive content strategy
│         Is content mission-critical?
│         ├─ YES → Show content with truncation
│         └─ NO → Hide content entirely
└─ NO → Is available width < 1024px?
    ├─ YES → Apply moderate content strategy  
    │         Is content high priority?
    │         ├─ YES → Show full content
    │         └─ NO → Show truncated content
    └─ NO → Show full content
            Is there extra space available?
            ├─ YES → Enhance with additional context/actions
            └─ NO → Maintain standard content display
```
