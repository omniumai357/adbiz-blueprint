
/**
 * Visual regression tests for the RewardCard component
 * 
 * Tests the RewardCard component's appearance across different breakpoints,
 * states, and configurations.
 */

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

// Mock the hooks and translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'discount': 'Discount',
        'claimReward': 'Claim Reward',
        'claimed': 'Claimed',
        'alreadyClaimed': 'Already Claimed',
        'achievedOn': options?.date ? `Achieved on ${options.date}` : 'Achieved',
        'claimRewardAriaLabel': options?.name ? `Claim ${options.name} reward` : 'Claim reward',
        'noDescription': 'No description available'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the useResponsive hook
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    activeBreakpoint: window.innerWidth < 640 ? 'xs' : 
                      window.innerWidth < 768 ? 'sm' :
                      window.innerWidth < 1024 ? 'md' :
                      window.innerWidth < 1280 ? 'lg' :
                      window.innerWidth < 1536 ? 'xl' : 'xxl'
  })
}));

describe('RewardCard Visual Tests', () => {
  // Standard mock data for tests
  const standardReward = {
    milestone_id: 'reward-1',
    milestone_name: 'First Purchase Discount',
    milestone_description: 'A reward for completing your first purchase',
    icon: 'gift',
    reward_type: 'discount_percentage',
    reward_value: 10,
    is_completed: true,
    reward_claimed: false,
    completed_at: '2023-10-15T12:00:00Z'
  };
  
  const mockOnClaim = jest.fn().mockResolvedValue({});
  
  beforeEach(() => {
    // Reset mock between tests
    mockOnClaim.mockClear();
  });
  
  // Test standard reward card across breakpoints
  testAllBreakpoints(
    'renders standard reward card correctly',
    ['xs', 'sm', 'md', 'lg', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <RewardCard
            reward={standardReward}
            onClaim={mockOnClaim}
            disabled={false}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'RewardCard', 
          breakpoint,
          'standard'
        )
      });
    }
  );
  
  // Test claimed reward card
  testAllBreakpoints(
    'renders claimed reward card correctly',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const claimedReward = { ...standardReward, reward_claimed: true, is_claimed: true };
      
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <RewardCard
            reward={claimedReward}
            onClaim={mockOnClaim}
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
  
  // Test disabled state (while processing)
  it('renders disabled reward card correctly', () => {
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <RewardCard
          reward={standardReward}
          onClaim={mockOnClaim}
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
  
  // Test fixed dollar amount reward
  it('renders dollar amount reward correctly', () => {
    const dollarReward = { 
      ...standardReward, 
      reward_type: 'discount_fixed',
      reward_value: 25
    };
    
    const { container } = render(
      <ResponsiveVisualTest breakpoint="md">
        <RewardCard
          reward={dollarReward}
          onClaim={mockOnClaim}
          disabled={false}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'RewardCard', 
        'md',
        'dollar-amount'
      )
    });
  });
  
  // Test with long text content
  it('handles long text content correctly', () => {
    const longTextReward = { 
      ...standardReward, 
      milestone_name: 'Very Long Milestone Name That Should Be Truncated on Mobile Devices',
      milestone_description: 'This is an extremely long description that tests how the component handles text overflow and ensures that appropriate ellipsis or wrapping is applied based on the current viewport size and available space.'
    };
    
    const { container } = render(
      <ResponsiveVisualTest breakpoint="xs">
        <RewardCard
          reward={longTextReward}
          onClaim={mockOnClaim}
          disabled={false}
        />
      </ResponsiveVisualTest>
    );
    
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'RewardCard', 
        'xs',
        'long-text'
      )
    });
  });
});
