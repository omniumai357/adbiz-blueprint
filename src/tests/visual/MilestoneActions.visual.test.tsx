
/**
 * Visual tests for milestone interaction states
 * 
 * Tests the visual appearance of milestone components during
 * various interaction states (hover, active, claiming rewards)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MilestoneCard } from '@/components/rewards/MilestoneCard';
import { 
  configureToMatchImageSnapshot,
  defaultSnapshotOptions,
  getSnapshotIdentifier,
  testAllBreakpoints
} from './visualRegressionSetup';
import ResponsiveVisualTest from './components/ResponsiveVisualTest';
import { Breakpoint } from '@/hooks/useResponsive';
import userEvent from '@testing-library/user-event';

// Configure the matcher
configureToMatchImageSnapshot();

// Mock the hooks and services
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'points': 'points',
        'pointsToGo': options?.points ? `${options.points} points to go` : 'Points to go',
        'completedMilestones': 'Completed',
        'claimReward': 'Claim Reward',
        'processing': 'Processing',
        'rewardClaimed': 'Reward Claimed',
        'claimRewardAriaLabel': options?.name ? `Claim ${options.name} reward` : 'Claim reward'
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

describe('Milestone Action States Visual Tests', () => {
  // Standard milestone props
  const standardProps = {
    name: 'First Purchase',
    description: 'Complete your first purchase and earn points',
    icon: 'shopping-cart',
    pointsRequired: 100,
    currentPoints: 50,
    isCompleted: false,
    rewardClaimed: false,
  };
  
  const mockClaimReward = jest.fn();
  
  beforeEach(() => {
    // Reset mock between tests
    mockClaimReward.mockReset();
  });
  
  // Test hover state on claim button
  it('shows correct hover state on claim button', async () => {
    // Create user event instance
    const user = userEvent.setup();
    
    const { container, getByRole } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...standardProps}
          isCompleted={true}
          rewardClaimed={false}
          onClaimReward={mockClaimReward}
        />
      </ResponsiveVisualTest>
    );
    
    // Take snapshot before hover
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneActions', 
        'md',
        'before-hover'
      )
    });
    
    // Hover over the button
    const button = getByRole('button');
    await user.hover(button);
    
    // Take snapshot during hover
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneActions', 
        'md',
        'during-hover'
      )
    });
  });
  
  // Test active/pressed state on claim button
  it('shows correct active state when button is pressed', async () => {
    const user = userEvent.setup();
    
    const { container, getByRole } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...standardProps}
          isCompleted={true}
          rewardClaimed={false}
          onClaimReward={mockClaimReward}
        />
      </ResponsiveVisualTest>
    );
    
    const button = getByRole('button');
    
    // Simulate mousedown on the button (pressed state)
    fireEvent.mouseDown(button);
    
    // Take snapshot during pressed state
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneActions', 
        'md',
        'button-pressed'
      )
    });
  });
  
  // Test processing state while claiming reward
  testAllBreakpoints(
    'shows processing state while claiming reward',
    ['xs', 'md', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveVisualTest breakpoint={breakpoint}>
          <MilestoneCard
            {...standardProps}
            isCompleted={true}
            rewardClaimed={false}
            onClaimReward={mockClaimReward}
            isClaimingReward={true}
          />
        </ResponsiveVisualTest>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestoneActions', 
          breakpoint,
          'processing'
        )
      });
    }
  );
  
  // Test transition to completed state
  it('renders correctly when transitioning to completed state', () => {
    // First render with incomplete state
    const { container, rerender } = render(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...standardProps}
          isCompleted={false}
          currentPoints={95}
        />
      </ResponsiveVisualTest>
    );
    
    // Take snapshot of nearly complete state
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneActions', 
        'md',
        'near-complete'
      )
    });
    
    // Re-render with completed state
    rerender(
      <ResponsiveVisualTest breakpoint="md">
        <MilestoneCard
          {...standardProps}
          isCompleted={true}
          currentPoints={100}
          onClaimReward={mockClaimReward}
        />
      </ResponsiveVisualTest>
    );
    
    // Take snapshot of completed state
    expect(container).toMatchImageSnapshot({
      ...defaultSnapshotOptions,
      customSnapshotIdentifier: getSnapshotIdentifier(
        'MilestoneActions', 
        'md',
        'just-completed'
      )
    });
  });
});
