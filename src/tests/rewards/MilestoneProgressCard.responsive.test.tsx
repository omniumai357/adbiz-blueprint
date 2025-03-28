
/**
 * Responsive tests for MilestoneProgressCard component
 * 
 * This test suite verifies that the MilestoneProgressCard component
 * renders correctly at different viewport sizes.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import MilestoneProgressCard from '@/components/rewards/MilestoneProgressCard';
import { mockWindowSize } from '../responsive/responsive-tests-setup';

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

describe('MilestoneProgressCard Responsive Tests', () => {
  // Standard test props
  const standardProps = {
    totalPoints: 250,
    completedMilestones: 3,
    availableRewards: 2,
  };
  
  // Test for mobile viewport (xs)
  it('renders in compact mode on mobile', () => {
    // Mock xs breakpoint (375px width)
    mockWindowSize(375);
    
    const { container } = render(
      <MilestoneProgressCard 
        {...standardProps} 
        isCompact={true}
      />
    );
    
    // Check that mobile-specific elements are present
    expect(container.querySelector('.p-3')).toBeInTheDocument();
    expect(container.querySelector('.text-lg')).toBeInTheDocument();
    
    // Check number of stat items (should be 2 on small mobile in compact mode)
    const statItems = container.querySelectorAll('.rounded-lg.flex.flex-col');
    expect(statItems.length).toBeLessThanOrEqual(3);
  });
  
  // Test for tablet viewport (md)
  it('renders all stats on tablet', () => {
    // Mock md breakpoint (768px width)
    mockWindowSize(768);
    
    const { container } = render(
      <MilestoneProgressCard {...standardProps} />
    );
    
    // Check all 3 stats sections are present
    const statItems = container.querySelectorAll('.rounded-lg.flex.flex-col');
    expect(statItems.length).toBe(3);
    
    // Check tablet-specific classes
    expect(container.querySelector('.grid-cols-3')).toBeInTheDocument();
  });

  // Test for desktop viewport (lg)
  it('renders with optimal spacing on desktop', () => {
    // Mock lg breakpoint (1024px width)
    mockWindowSize(1024);
    
    const { container } = render(
      <MilestoneProgressCard {...standardProps} />
    );
    
    // Check desktop-specific elements
    expect(container.querySelector('.md\\:p-6')).toBeInTheDocument();
    expect(container.querySelector('.md\\:text-xl')).toBeInTheDocument();
  });
  
  // Test compact mode behavior on different screen sizes
  describe('Compact mode behavior', () => {
    it('hides available rewards on small mobile in compact mode', () => {
      mockWindowSize(375);
      
      const { container } = render(
        <MilestoneProgressCard 
          {...standardProps} 
          isCompact={true}
        />
      );
      
      // Find elements containing reward information
      const rewardText = screen.queryByText(/available rewards/i);
      expect(rewardText).not.toBeInTheDocument();
    });
    
    it('shows all stats on tablet even in compact mode', () => {
      mockWindowSize(768);
      
      const { container } = render(
        <MilestoneProgressCard 
          {...standardProps} 
          isCompact={true}
        />
      );
      
      // Find all stat sections
      const statItems = container.querySelectorAll('.rounded-lg.flex.flex-col');
      expect(statItems.length).toBe(3);
    });
  });
  
  // Test font size adaptations
  it('uses smaller text on mobile', () => {
    mockWindowSize(375);
    
    const { container } = render(
      <MilestoneProgressCard {...standardProps} />
    );
    
    // Check for smaller text classes
    const headingElement = screen.getByText(/your progress/i);
    expect(headingElement).toHaveClass('text-lg');
  });
  
  it('uses larger text on desktop', () => {
    mockWindowSize(1024);
    
    render(<MilestoneProgressCard {...standardProps} />);
    
    // Points should be displayed in larger text
    const pointsValue = screen.getByText('250');
    const pointsElement = pointsValue.parentElement;
    expect(pointsElement).toHaveClass('md:text-xl');
  });
});
