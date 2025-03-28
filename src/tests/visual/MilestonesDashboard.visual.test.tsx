
import React from 'react';
import { render } from '@testing-library/react';
import MilestonesDashboard from '@/components/rewards/MilestonesDashboard';
import { 
  configureToMatchImageSnapshot,
  defaultSnapshotOptions,
  getSnapshotIdentifier,
  testAllBreakpoints
} from './visualRegressionSetup';
import ResponsiveVisualTest from './components/ResponsiveVisualTest';
import { Breakpoint } from '@/hooks/useResponsive';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup a fresh query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// Mock the hooks and services
jest.mock('@/hooks/rewards/useMilestones', () => ({
  useMilestones: (userId: string | undefined) => ({
    milestones: [
      {
        id: 'milestone-1',
        milestone_id: 'm-1',
        milestone_name: 'First Purchase',
        milestone_description: 'Complete your first purchase',
        icon: 'shopping-cart',
        current_points: 100,
        points_target: 100,
        is_completed: true,
        reward_claimed: false
      },
      {
        id: 'milestone-2',
        milestone_id: 'm-2',
        milestone_name: 'Profile Completion',
        milestone_description: 'Fill out your complete profile',
        icon: 'user',
        current_points: 75,
        points_target: 100,
        is_completed: false,
        reward_claimed: false
      }
    ],
    completedMilestones: [
      {
        id: 'milestone-1',
        milestone_id: 'm-1',
        milestone_name: 'First Purchase',
        milestone_description: 'Complete your first purchase',
        icon: 'shopping-cart',
        current_points: 100,
        points_target: 100,
        is_completed: true,
        reward_claimed: false
      }
    ],
    availableRewards: [
      {
        milestone_id: 'reward-1',
        milestone_name: 'First Purchase Discount',
        milestone_description: 'A reward for completing your first purchase',
        icon: 'gift',
        reward_type: 'discount_percentage',
        reward_value: 10,
        is_completed: true,
        reward_claimed: false,
        completed_at: '2023-10-15T12:00:00Z'
      }
    ],
    totalPoints: 175,
    isLoading: false,
    error: null,
    refreshData: jest.fn()
  }),
  
  useRewardActions: () => ({
    claimReward: () => Promise.resolve(),
    isProcessing: false
  })
}));

// Configure the matcher
configureToMatchImageSnapshot();

describe('MilestonesDashboard Visual Tests', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = createTestQueryClient();
  });
  
  // Test dashboard with user data
  testAllBreakpoints(
    'renders dashboard with user data correctly',
    ['xs', 'sm', 'md', 'lg', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <ResponsiveVisualTest breakpoint={breakpoint}>
            <MilestonesDashboard userId="user-123" />
          </ResponsiveVisualTest>
        </QueryClientProvider>
      );
      
      expect(container).toMatchImageSnapshot({
        ...defaultSnapshotOptions,
        customSnapshotIdentifier: getSnapshotIdentifier(
          'MilestonesDashboard', 
          breakpoint,
          'with-data'
        )
      });
    }
  );
  
  // More specialized test cases could be added here for different data scenarios
});
