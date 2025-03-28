
import { Breakpoint } from '@/hooks/useResponsive';

// Components to capture
export const COMPONENTS_TO_CAPTURE = [
  'MilestoneCard',
  'MilestoneProgressCard',
  'RewardCard',
  'MilestonesDashboard',
  // Add more components as needed
];

// States to capture for interactive components
export const INTERACTIVE_STATES = ['default', 'hover', 'active', 'disabled'];

// Breakpoints to capture
export const BREAKPOINTS_TO_CAPTURE: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

// Output directory for the visual reference library
export const OUTPUT_DIR = 'docs/visual-reference-library';

/**
 * Generate a component preview URL
 */
export function getComponentPreviewUrl(component: string, breakpoint: Breakpoint, state: string = 'default') {
  // This URL should point to your component preview page
  // Adjust as needed based on your development environment
  return `http://localhost:5173/component-preview?component=${component}&breakpoint=${breakpoint}&state=${state}`;
}
