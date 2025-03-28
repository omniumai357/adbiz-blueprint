
import React from 'react';
import { render } from '@testing-library/react';
import RewardCard from '@/components/rewards/RewardCard';
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

describe('RewardCard Visual Tests', () => {
  // Sample reward data for testing
  const sampleReward = {
    milestone_id: 'reward-1',
    milestone_name: 'First Purchase Discount',
    milestone_description: 'A reward for completing your first purchase',
    icon: 'gift',
    is_completed: true,
    reward_claimed: false,
    reward_type: 'discount_percentage',
    reward_value: 10,
    completed_at: '2023-10-15T12:00:00Z'
  };

  // Test available reward state
  testAllBreakpoints(
    'renders unclaimed reward correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <RewardCard 
            reward={sampleReward}
            onClaim={() => Promise.resolve()}
            disabled={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'RewardCard', 
          breakpoint,
          'unclaimed'
        )
      });
    }
  );

  // Test claimed reward state
  testAllBreakpoints(
    'renders claimed reward correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const claimedReward = {
        ...sampleReward,
        reward_claimed: true,
        is_claimed: true
      };
      
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <RewardCard 
            reward={claimedReward}
            onClaim={() => Promise.resolve()}
            disabled={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'RewardCard', 
          breakpoint,
          'claimed'
        )
      });
    }
  );

  // Test fixed amount reward instead of percentage
  testAllBreakpoints(
    'renders fixed amount reward correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const fixedReward = {
        ...sampleReward,
        reward_type: 'discount_fixed',
        reward_value: 25
      };
      
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <RewardCard 
            reward={fixedReward}
            onClaim={() => Promise.resolve()}
            disabled={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'RewardCard', 
          breakpoint,
          'fixed-amount'
        )
      });
    }
  );

  // Test disabled state
  it('renders disabled state correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <RewardCard 
          reward={sampleReward}
          onClaim={() => Promise.resolve()}
          disabled={true}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'RewardCard', 
        'md',
        'disabled'
      )
    });
  });

  // Test long content handling
  it('handles long content correctly', () => {
    const longContentReward = {
      ...sampleReward,
      milestone_name: 'This is an extremely long milestone name that should be properly truncated on smaller screens',
      milestone_description: 'This description is intentionally very long to test how the component handles text overflow and wrapping across different screen sizes. We want to make sure that the card still looks good and maintains its design integrity.'
    };
    
    const { container } = render(
      <ResponsiveVisualTest breakpoint="xs">
        <RewardCard 
          reward={longContentReward}
          onClaim={() => Promise.resolve()}
          disabled={false}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'RewardCard', 
        'xs',
        'long-content'
      )
    });
  });
});
