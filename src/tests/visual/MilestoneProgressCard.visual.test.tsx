
import React from 'react';
import { render } from '@testing-library/react';
import MilestoneProgressCard from '@/components/rewards/MilestoneProgressCard';
import { 
  configureToMatchImageSnapshot,
  defaultSnapshotOptions,
  getSnapshotIdentifier,
  testAllBreakpoints
} from './visualRegressionSetup';
import ResponsiveVisualTest from './components/ResponsiveVisualTest';
import { Breakpoint } from '@/hooks/useResponsive';

// Configure the matcher
configureToMatchImageSnapshot();

describe('MilestoneProgressCard Visual Tests', () => {
  // Test with various data combinations to ensure robust snapshots
  
  // Standard display with full metrics
  testAllBreakpoints(
    'renders standard progress card correctly',
    ['xs', 'md', 'xl', 'xxl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneProgressCard
            totalPoints={450}
            completedMilestones={3}
            availableRewards={2}
            isCompact={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneProgressCard', 
          breakpoint,
          'standard'
        )
      });
    }
  );

  // Compact mode for mobile/tablet
  testAllBreakpoints(
    'renders compact progress card correctly',
    ['xs', 'sm', 'md'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneProgressCard
            totalPoints={450}
            completedMilestones={3}
            availableRewards={2}
            isCompact={true}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneProgressCard', 
          breakpoint,
          'compact'
        )
      });
    }
  );

  // New user with zero metrics
  testAllBreakpoints(
    'renders zero-state progress card correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneProgressCard
            totalPoints={0}
            completedMilestones={0}
            availableRewards={0}
            isCompact={breakpoint === 'xs'}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneProgressCard', 
          breakpoint,
          'zero-state'
        )
      });
    }
  );

  // Advanced user with high metrics
  it('renders high-value metrics correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="lg">
        <MilestoneProgressCard
          totalPoints={9999}
          completedMilestones={25}
          availableRewards={10}
          isCompact={false}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneProgressCard', 
        'lg',
        'high-value'
      )
    });
  });
});
