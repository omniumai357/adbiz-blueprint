
import { useState, useEffect } from "react";
import MilestoneProgressCard from "./MilestoneProgressCard";
import MilestoneCard from "./MilestoneCard";
import RewardCard from "./RewardCard";
import { useMilestones } from "@/hooks/rewards/useMilestones";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingContent } from "@/components/ui/loading-content";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MilestonesDashboardProps {
  userId: string | undefined;
}

const MilestonesDashboard = ({ userId }: MilestonesDashboardProps) => {
  const {
    milestonesData,
    totalPoints,
    availableRewards,
    isLoading,
    error,
    claimReward,
    isClaimingReward
  } = useMilestones(userId);

  const MilestonesSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-[150px] w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[220px] rounded-lg" />
        <Skeleton className="h-[220px] rounded-lg" />
        <Skeleton className="h-[220px] rounded-lg" />
      </div>
    </div>
  );

  const EmptyMilestones = () => (
    <div className="p-6 text-center border rounded-lg">
      <h3 className="text-lg font-medium mb-2">No Milestones Available</h3>
      <p className="text-muted-foreground">
        Start using our services to earn points and unlock rewards!
      </p>
    </div>
  );

  return (
    <LoadingContent
      isLoading={isLoading}
      error={error}
      isEmpty={milestonesData.length === 0 && availableRewards.length === 0}
      emptyContent={<EmptyMilestones />}
      useSkeleton={true}
      skeletonContent={<MilestonesSkeleton />}
    >
      <div className="space-y-6">
        {/* Progress Overview */}
        <MilestoneProgressCard totalPoints={totalPoints} />
        
        {/* Milestones & Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Display available rewards */}
          {availableRewards.map((reward) => (
            <RewardCard
              key={reward.milestone_id}
              reward={reward}
              onClaim={claimReward}
              isProcessing={isClaimingReward}
            />
          ))}
          
          {/* Display milestones */}
          {milestonesData.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    </LoadingContent>
  );
};

export default MilestonesDashboard;
