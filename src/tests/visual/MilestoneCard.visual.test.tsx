
/**
 * Visual regression test for MilestoneCard component
 * 
 * Tests the appearance of the component across different breakpoints
 * and in different states (default, completed, in-progress)
 */

import React from 'react';
import { render } from '@testing-library/react';
import MilestoneCard from '@/components/rewards/MilestoneCard';
import ResponsiveTestWrapper from '../components/ResponsiveTestWrapper';
import { createResponsiveVisualTests, testAllBreakpoints } from './visualRegressionSetup';
import { Breakpoint } from '@/hooks/useResponsive';

// Standard test props
const defaultProps = {
  name: 'First Purchase',
  description: 'Complete your first purchase to earn this milestone.',
  icon: 'shopping-cart',
  pointsRequired: 100,
  currentPoints: 50,
  isCompleted: false,
  rewardClaimed: false,
  onClaim: jest.fn()
};

describe('MilestoneCard Visual Tests', () => {
  // Test in default state across breakpoints
  createResponsiveVisualTests(
    'MilestoneCard',
    (breakpoint: Breakpoint) => (
      <ResponsiveTestWrapper breakpoint={breakpoint}>
        <MilestoneCard {...defaultProps} />
      </ResponsiveTestWrapper>
    )
  );

  // Test completed state
  testAllBreakpoints(
    'renders completed milestone correctly',
    ['xs', 'md', 'xl'],
    (breakpoint) => {
      const { container } = render(
        <ResponsiveTestWrapper breakpoint={breakpoint}>
          <MilestoneCard
            {...defaultProps}
            isCompleted={true}
            currentPoints={100}
          />
        </ResponsiveTestWrapper>
      );
      
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: `MilestoneCard-${breakpoint}-completed`
      });
    }
  );
  
  // Test claimed state
  testAllBreakpoints(
    'renders claimed reward correctly',
    ['xs', 'md', 'xl'],
    (breakpoint) => {
      const { container } = render(
        <ResponsiveTestWrapper breakpoint={breakpoint}>
          <MilestoneCard
            {...defaultProps}
            isCompleted={true}
            rewardClaimed={true}
            currentPoints={100}
          />
        </ResponsiveTestWrapper>
      );
      
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: `MilestoneCard-${breakpoint}-claimed`
      });
    }
  );
  
  // Test near completion state
  testAllBreakpoints(
    'renders near-completion milestone correctly',
    ['xs', 'md', 'xl'],
    (breakpoint) => {
      const { container } = render(
        <ResponsiveTestWrapper breakpoint={breakpoint}>
          <MilestoneCard
            {...defaultProps}
            currentPoints={90}
          />
        </ResponsiveTestWrapper>
      );
      
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: `MilestoneCard-${breakpoint}-near-completion`
      });
    }
  );
});
