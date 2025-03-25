
import React from "react";
import Header from "@/components/Header";
import MilestonesDashboard from "@/components/rewards/MilestonesDashboard";
import { useRewardsPage } from "@/hooks/rewards/useRewardsPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { user, isLoading, error } = useRewardsPage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Rewards & Milestones</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[100px] w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-[200px] rounded-lg" />
                <Skeleton className="h-[200px] rounded-lg" />
                <Skeleton className="h-[200px] rounded-lg" />
              </div>
            </div>
          ) : (
            // Pass the user ID to the milestones dashboard
            <MilestonesDashboard userId={user?.id} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Rewards;
