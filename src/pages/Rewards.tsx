
import React, { useState } from "react";
import Header from "@/components/Header";
import MilestonesDashboard from "@/components/rewards/MilestonesDashboard";
import { useRewardsPage } from "@/hooks/rewards/useRewardsPage";
import { LoadingContent } from "@/components/ui/loading-content";

/**
 * Rewards Page Component
 * 
 * Displays the user's milestones and rewards dashboard.
 * 
 * Features:
 * - Accessed via the /rewards route
 * - Gets the current user from the rewards page hook
 * - Passes user ID to the milestones dashboard
 * - Displays reward progress and available rewards
 * - Handles both authenticated and unauthenticated states
 * - Shows loading states and error messages
 * 
 * @remarks
 * The Rewards page integrates with the MilestonesDashboard component to display
 * user progress towards various milestones. User authentication is handled through
 * the auth context via the useRewardsPage hook.
 */
const Rewards = () => {
  // Get current authenticated user and page state from hook
  const { user, isLoading, error: pageError } = useRewardsPage();
  const [error, setError] = useState<Error | null>(pageError ? new Error(pageError) : null);

  // Skeleton component for when user data is loading
  const RewardsPageSkeleton = () => (
    <div className="space-y-4">
      <div className="h-8 w-64 mb-8 bg-muted animate-pulse rounded-md" />
      <div className="h-[100px] w-full rounded-lg bg-muted animate-pulse mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );

  // Empty state for when user is not authenticated
  const AuthenticationRequired = () => (
    <div className="text-center py-8 px-4 border border-dashed rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
      <p className="text-muted-foreground mb-4">
        Please sign in to view your rewards and milestones.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Rewards & Milestones</h1>
          
          <LoadingContent
            isLoading={isLoading}
            error={error}
            isEmpty={!user}
            emptyContent={<AuthenticationRequired />}
            useSkeleton={true}
            skeletonContent={<RewardsPageSkeleton />}
          >
            {/* Pass the user ID to the milestones dashboard */}
            <MilestonesDashboard userId={user?.id} />
          </LoadingContent>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
