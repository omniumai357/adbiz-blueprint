
# Component Testing Documentation Template

This template provides a structured format for documenting the expected responsive behavior of components. Use it to create comprehensive testing documentation for each component in the rewards system.

## Component Name: [ComponentName]

### Basic Information
- **File Path**: `src/components/path/to/ComponentName.tsx`
- **Purpose**: Brief description of what this component does
- **Parent Components**: List of components that use this component
- **Child Components**: List of components used by this component

### Responsive Behavior

#### Breakpoint: xs (<640px)
- **Layout**: 
  - Single column layout
  - Top to bottom content ordering
  - Centered alignment
- **Typography**:
  - Title: 16px (text-base)
  - Description: 14px (text-sm)
  - Labels: 12px (text-xs)
- **Spacing**:
  - Padding: 12px (p-3)
  - Gap between elements: 8px (gap-2)
- **Visual Elements**:
  - Icons: 16px × 16px
  - Images: Responsive width, max-height 120px
- **Interactive Elements**:
  - Buttons: Full width, 40px height
  - Touch targets: Minimum 44px × 44px
- **Expected Behavior**:
  - Text truncation after 2 lines with ellipsis
  - Horizontal scrolling disabled
  - Vertical scrolling enabled when needed

#### Breakpoint: sm (640px-767px)
[Fill in details for this breakpoint]

#### Breakpoint: md (768px-1023px)
[Fill in details for this breakpoint]

#### Breakpoint: lg (1024px-1279px)
[Fill in details for this breakpoint]

#### Breakpoint: xl (1280px-1535px)
[Fill in details for this breakpoint]

#### Breakpoint: xxl (≥1536px)
[Fill in details for this breakpoint]

### State Variations

#### Default State
- Screenshot: [Link to screenshot]
- Description of appearance in default state

#### Loading State
- Screenshot: [Link to screenshot]
- Description of appearance in loading state

#### Error State
- Screenshot: [Link to screenshot]
- Description of appearance in error state

#### Empty State
- Screenshot: [Link to screenshot]
- Description of appearance when no data is available

#### Interactive States
- Hover: [Description and screenshot]
- Active/Pressed: [Description and screenshot]
- Focus: [Description and screenshot]
- Disabled: [Description and screenshot]

### Accessibility Requirements
- Keyboard navigation: [Description of expected behavior]
- Screen reader experience: [Description of expected announcements]
- Contrast requirements: [Minimum contrast ratios]
- Focus indicators: [Description of focus visibility]

### Performance Considerations
- Render timing expectations: [Performance budget in ms]
- Animation smoothness: [Target fps]
- Lazy loading behavior: [When and how components should lazy load]

### Testing Checklist
- [ ] Renders correctly at all breakpoints
- [ ] All state variations display correctly
- [ ] Interactive elements respond appropriately
- [ ] Animations perform smoothly
- [ ] Meets accessibility requirements
- [ ] Internationalization works correctly
- [ ] Meets performance benchmarks

### Known Issues and Limitations
- [Document any known issues or edge cases]
- [Document any browser-specific quirks]

### Review History
- Initial documentation: [Date, Author]
- Last updated: [Date, Author]
- Last visual review: [Date, Reviewer]

---

## Example: Filled template for MilestoneProgressCard

### Basic Information
- **File Path**: `src/components/rewards/MilestoneProgressCard.tsx`
- **Purpose**: Displays the user's overall milestone progress including total points, completed milestones, and available rewards
- **Parent Components**: MilestonesDashboard
- **Child Components**: None (uses UI primitives only)

### Responsive Behavior

#### Breakpoint: xs (<640px)
- **Layout**: 
  - Full width card with gradient background
  - Grid layout with 2 columns (no rewards column in compact mode)
  - Stats displayed in condensed format
- **Typography**:
  - Title: 18px (text-lg)
  - Stat labels: 12px (text-xs)
  - Stat values: 18px (text-lg)
- **Spacing**:
  - Card padding: 12px (p-3)
  - Grid gap: 8px (gap-2)
- **Visual Elements**:
  - Icons: 20px × 20px (h-5 w-5)
  - Background: Subtle gradient from slate-50 to white
- **Interactive Elements**:
  - No direct interactive elements
- **Expected Behavior**:
  - In compact mode, shows only two stats (points and completed milestones)
  - Labels are kept short to prevent overflow

[Continue with remaining breakpoints and sections...]
