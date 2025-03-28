
/**
 * Responsive tests for MilestoneCard component
 * 
 * This test suite verifies that the MilestoneCard component
 * renders correctly at different viewport sizes.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneCard } from '@/components/rewards/MilestoneCard';
import { TEST_BREAKPOINTS, mockWindowSize } from '../responsive/responsive-tests-setup';

describe('MilestoneCard Responsive Tests', () => {
  // Standard test props to use across all test cases
  const standardProps = {
    name: 'First Purchase',
    description: 'Complete your first purchase and earn points toward rewards',
    icon: 'shopping-cart',
    pointsRequired: 100,
    currentPoints: 50,
    isCompleted: false,
    rewardClaimed: false,
  };
  
  // Test for mobile viewport (xs)
  it('renders correctly on mobile', () => {
    // Mock xs breakpoint (375px width)
    mockWindowSize(375);
    
    const { container } = render(<MilestoneCard {...standardProps} />);
    
    // Check that mobile-specific elements are present
    expect(container.querySelector('.text-base')).toBeInTheDocument();
    expect(container.querySelector('.p-3')).toBeInTheDocument();
  });
  
  // Test for tablet viewport (md)
  it('renders correctly on tablet', () => {
    // Mock md breakpoint (768px width)
    mockWindowSize(768);
    
    const { container } = render(<MilestoneCard {...standardProps} />);
    
    // Check tablet-specific elements
    expect(screen.getByText('First Purchase')).toBeInTheDocument();
    expect(container.querySelector('.text-sm')).toBeInTheDocument();
  });

  // Test for desktop viewport (lg)
  it('renders correctly on desktop', () => {
    // Mock lg breakpoint (1024px width)
    mockWindowSize(1024);
    
    const { container } = render(<MilestoneCard {...standardProps} />);
    
    // Check desktop-specific elements
    expect(screen.getByText('First Purchase')).toBeInTheDocument();
    expect(container.querySelector('.text-lg')).toBeInTheDocument();
  });
  
  // Test completed state
  it('renders completed state correctly on mobile', () => {
    mockWindowSize(375);
    
    const { container } = render(
      <MilestoneCard 
        {...standardProps} 
        isCompleted={true} 
        currentPoints={100}
      />
    );
    
    // Check that completed state indicators are present
    expect(container.querySelector('.border-green-200')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });
  
  // Test reward claimed state
  it('renders claimed reward state correctly', () => {
    const { container } = render(
      <MilestoneCard 
        {...standardProps} 
        isCompleted={true}
        rewardClaimed={true}
        currentPoints={100}
      />
    );
    
    // Check that claimed indicators are present
    expect(screen.getByText(/reward claimed/i)).toBeInTheDocument();
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
  });
  
  // Test progress visualization changes across breakpoints
  describe('Progress visualization', () => {
    TEST_BREAKPOINTS.filter(bp => ['xs', 'md', 'xl'].includes(bp.name)).forEach(breakpoint => {
      it(`shows appropriate progress indicator at ${breakpoint.name} breakpoint`, () => {
        mockWindowSize(breakpoint.width, breakpoint.height);
        
        render(<MilestoneCard {...standardProps} />);
        
        // Progress should show as 50%
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      });
    });
  });
  
  // Test action button sizes on different screens
  it('has appropriately sized action button on mobile', () => {
    mockWindowSize(375);
    
    const { container } = render(
      <MilestoneCard 
        {...standardProps} 
        isCompleted={true}
        rewardClaimed={false}
        onClaimReward={() => {}}
      />
    );
    
    // On mobile, button should have "sm" size
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });
});
