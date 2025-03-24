
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

const MilestonesDashboard: React.FC<MilestonesDashboardProps> = ({ userId }) => {
  const { 
    progress, 
    availableRewards, 
    totalPoints, 
    isLoading, 
    claimReward 
  } = useMilestones(userId);

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
                  onClaim={claimReward} 
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
