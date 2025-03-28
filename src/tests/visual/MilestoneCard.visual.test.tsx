
import React from 'react';
import { render } from '@testing-library/react';
import { MilestoneCard } from '@/components/rewards/MilestoneCard';
import { ResponsiveVisualTest } from './components/ResponsiveVisualTest';
import { testAllBreakpoints } from './visualRegressionSetup';
import { Breakpoint } from '@/hooks/useResponsive';

// Mock translations (if using i18next)
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: jest.fn(),
      },
    };
  },
}));

describe('MilestoneCard Visual Tests', () => {
  // Define standard props for consistent testing
  const defaultProps = {
    name: 'First Purchase',
    description: 'Complete your first purchase to earn rewards',
    icon: 'shopping-bag',
    pointsRequired: 100,
    currentPoints: 50,
    isCompleted: false,
    rewardClaimed: false,
  };

  testAllBreakpoints(
    'MilestoneCard renders correctly',
    ['xs', 'sm', 'md', 'lg', 'xl'],
    (breakpoint: Breakpoint) => {
      // Render component inside the responsive test container
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard {...defaultProps} />
        </ResponsiveVisualTest>
      );

      // Take snapshot
      expect(container).toMatchImageSnapshot({
        customSnapshotIdentifier: `milestone-card-default-${breakpoint}`,
      });
    }
  );

  // Test different states
  it('renders completed state correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...defaultProps}
          isCompleted={true}
          currentPoints={100}
        />
      </ResponsiveVisualTest>
    );

    expect(container).toMatchImageSnapshot({
      customSnapshotIdentifier: 'milestone-card-completed',
    });
  });

  it('renders claimed reward state correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...defaultProps}
          isCompleted={true}
          rewardClaimed={true}
          currentPoints={100}
        />
      </ResponsiveVisualTest>
    );

    expect(container).toMatchImageSnapshot({
      customSnapshotIdentifier: 'milestone-card-claimed',
    });
  });
});
