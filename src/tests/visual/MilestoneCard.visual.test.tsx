
import React from 'react';
import { render } from '@testing-library/react';
import { MilestoneCard } from '@/components/rewards/MilestoneCard';
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

describe('MilestoneCard Visual Tests', () => {
  // Standard test data for consistency
  const standardProps = {
    name: 'Complete First Purchase',
    description: 'Make your first purchase to earn points and unlock rewards',
    icon: 'shopping-bag',
    pointsRequired: 100,
    currentPoints: 50,
    isCompleted: false,
    rewardClaimed: false
  };

  // In-progress milestone card (default state)
  testAllBreakpoints(
    'renders in-progress milestone correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      // Render component in responsive test container
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard {...standardProps} />
        </ResponsiveVisualTest>
      );
      
      // Take screenshot and compare with baseline
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneCard', 
          breakpoint,
          'in-progress'
        )
      });
    }
  );

  // Nearly complete milestone
  testAllBreakpoints(
    'renders nearly complete milestone correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard 
            {...standardProps}
            currentPoints={90}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneCard', 
          breakpoint,
          'nearly-complete'
        )
      });
    }
  );

  // Completed milestone with reward available
  testAllBreakpoints(
    'renders completed milestone with available reward correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard 
            {...standardProps}
            currentPoints={100}
            isCompleted={true}
            rewardClaimed={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneCard', 
          breakpoint,
          'completed-unclaimed'
        )
      });
    }
  );

  // Completed milestone with claimed reward
  testAllBreakpoints(
    'renders claimed milestone correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard 
            {...standardProps}
            currentPoints={100}
            isCompleted={true}
            rewardClaimed={true}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneCard', 
          breakpoint,
          'completed-claimed'
        )
      });
    }
  );

  // Claiming in progress state
  it('renders claiming reward state correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard 
          {...standardProps}
          currentPoints={100}
          isCompleted={true}
          rewardClaimed={false}
          isClaimingReward={true}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneCard', 
        'md',
        'claiming'
      )
    });
  });
});
