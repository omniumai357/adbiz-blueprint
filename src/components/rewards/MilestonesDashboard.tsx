
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Star } from "lucide-react";
import { useMilestones } from "@/hooks/rewards/useMilestones";
import MilestoneProgressCard from "@/components/rewards/MilestoneProgressCard";
import RewardCard from "@/components/rewards/RewardCard";

interface MilestonesDashboardProps {
  userId: string | null | undefined;
}

/**
 * Renders a dashboard for user milestones and rewards
 * 
 * Features:
 * - Displays total points earned
 * - Shows progress toward active milestones
 * - Lists available rewards that can be claimed
 * - Handles the reward claim process
 * 
 * Shows appropriate UI states for:
 * - Not logged in users (sign-in prompt)
 * - Loading state (skeletons)
 * - Empty states (no milestones/rewards)
 * 
 * @param userId - The ID of the user whose milestones to display
 */
const MilestonesDashboard: React.FC<MilestonesDashboardProps> = ({ userId }) => {
  // Get milestone data and functions from the useMilestones hook
  const { 
    progress, 
    availableRewards, 
    totalPoints, 
    isLoading, 
    claimReward 
  } = useMilestones(userId);

  // Show sign-in prompt for non-authenticated users
  if (!userId) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Milestones & Rewards</CardTitle>
          <CardDescription>Sign in to track your milestones and earn rewards</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with total points display */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Milestones</h2>
          <p className="text-muted-foreground">
            Track your progress and claim rewards
          </p>
        </div>
        <Card className="bg-primary-50 border-none shadow">
          <CardContent className="flex items-center p-4 gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Progress and Rewards */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="rewards">
            Rewards
            {availableRewards.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {availableRewards.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Progress tab content */}
        <TabsContent value="progress">
          {progress.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Milestones Yet</CardTitle>
                <CardDescription>
                  Complete activities to earn points and unlock milestones
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {progress.map((milestone) => (
                <MilestoneProgressCard 
                  key={milestone.milestone_id} 
                  milestone={milestone} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Rewards tab content */}
        <TabsContent value="rewards">
          {availableRewards.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Rewards Available</CardTitle>
                <CardDescription>
                  Complete milestones to unlock exciting rewards
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {availableRewards.map((reward) => (
                <RewardCard 
                  key={reward.milestone_id} 
                  reward={reward} 
                  onClaim={(milestoneId) => {
                    claimReward(milestoneId);
                    // Return a resolved promise since the component expects a Promise return type
                    return Promise.resolve(true);
                  }} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilestonesDashboard;
