
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breakpoint } from '@/hooks/useResponsive';
import ResponsiveVisualTest from '@/tests/visual/components/ResponsiveVisualTest';
import MilestoneCard from '@/components/rewards/MilestoneCard';
import MilestoneProgressCard from '@/components/rewards/MilestoneProgressCard';
import RewardCard from '@/components/rewards/RewardCard';
import MilestonesDashboard from '@/components/rewards/MilestonesDashboard';

/**
 * Component Preview Page
 * 
 * This component is used by the Visual Reference Library generator
 * to capture screenshots of components at different breakpoints.
 */
const ComponentPreviewPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const componentName = params.get('component') || '';
  const breakpoint = (params.get('breakpoint') || 'md') as Breakpoint;
  const state = params.get('state') || 'default';
  
  return (
    <div className="p-4">
      <ResponsiveVisualTest 
        breakpoint={breakpoint}
        showIndicator={false}
        testId={`${componentName}-preview`}
      >
        {renderComponent(componentName, state)}
      </ResponsiveVisualTest>
    </div>
  );
};

/**
 * Render a specific component with the given state
 */
function renderComponent(componentName: string, state: string) {
  // Mock data for components
  const mockProps = {
    milestone: {
      id: 'milestone-1',
      name: 'First Purchase',
      description: 'Complete your first purchase to earn 100 points',
      pointsRequired: 100,
      currentPoints: 50,
      isCompleted: state === 'completed',
      rewardClaimed: state === 'claimed',
      icon: 'shopping-bag'
    },
    reward: {
      id: 'reward-1',
      name: '10% Discount',
      description: 'Get 10% off your next purchase',
      pointsRequired: 500,
      isAvailable: state !== 'unavailable',
      isRedeemed: state === 'redeemed',
      icon: 'percent'
    }
  };
  
  // Return the requested component with appropriate props
  switch (componentName) {
    case 'MilestoneCard':
      return (
        <MilestoneCard
          id={mockProps.milestone.id}
          name={mockProps.milestone.name}
          description={mockProps.milestone.description}
          pointsRequired={mockProps.milestone.pointsRequired}
          currentPoints={mockProps.milestone.currentPoints}
          isCompleted={mockProps.milestone.isCompleted}
          rewardClaimed={mockProps.milestone.rewardClaimed}
          icon={mockProps.milestone.icon}
        />
      );
      
    case 'MilestoneProgressCard':
      return <MilestoneProgressCard totalPoints={750} completedMilestones={3} availableRewards={2} />;
      
    case 'RewardCard':
      return (
        <RewardCard
          id={mockProps.reward.id}
          name={mockProps.reward.name}
          description={mockProps.reward.description}
          pointsRequired={mockProps.reward.pointsRequired}
          isAvailable={mockProps.reward.isAvailable}
          isRedeemed={mockProps.reward.isRedeemed}
          icon={mockProps.reward.icon}
        />
      );
      
    case 'MilestonesDashboard':
      return <MilestonesDashboard userId="user-123" />;
      
    default:
      return <div>Component not found: {componentName}</div>;
  }
}

export default ComponentPreviewPage;
