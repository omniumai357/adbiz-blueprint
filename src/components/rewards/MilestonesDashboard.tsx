
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { MilestoneCard } from "./MilestoneCard";
import RewardCard from "./RewardCard";
import { useMilestones } from "@/hooks/rewards/useMilestones";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingContent } from "@/components/ui/loading-content";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRewardActions } from "@/hooks/rewards/useRewardActions";
import MilestoneProgressCard from "./MilestoneProgressCard";
import { createComponentLogger } from "@/lib/utils/logging";
import { useMediaQuery } from "@/hooks/use-media-query";

const logger = createComponentLogger('MilestonesDashboard');

interface MilestonesDashboardProps {
  userId: string | undefined;
}

const MilestonesDashboard = ({ userId }: MilestonesDashboardProps) => {
  const { t } = useTranslation();
  const isTabletOrMobile = useMediaQuery("(max-width: 1023px)");
  
  const {
    milestones,
    completedMilestones,
    availableRewards,
    totalPoints,
    isLoading,
    error,
    refreshData
  } = useMilestones(userId);

  // Get reward actions functionality
  const { claimReward, isProcessing } = useRewardActions(userId || null, refreshData);
  
  // State for error tracking
  const [localError, setLocalError] = useState<Error | null>(null);
  
  // Log performance metrics
  useEffect(() => {
    logger.debug('Milestones dashboard loaded', { 
      totalMilestones: milestones.length,
      completedMilestones: completedMilestones.length,
      availableRewards: availableRewards.length 
    });
    
    return () => {
      logger.debug('Milestones dashboard unmounted');
    };
  }, [milestones.length, completedMilestones.length, availableRewards.length]);

  const MilestonesSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-[120px] md:h-[150px] w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-[180px] md:h-[220px] rounded-lg" />
        <Skeleton className="h-[180px] md:h-[220px] rounded-lg" />
        <Skeleton className="h-[180px] md:h-[220px] rounded-lg" />
      </div>
    </div>
  );

  const EmptyMilestones = () => (
    <div className="p-4 md:p-6 text-center border rounded-lg">
      <h3 className="text-lg font-medium mb-2">{t('rewards.noMilestones')}</h3>
      <p className="text-muted-foreground">
        {t('rewards.startEarning')}
      </p>
    </div>
  );

  return (
    <LoadingContent
      isLoading={isLoading}
      error={error || localError}
      isEmpty={milestones.length === 0 && availableRewards.length === 0}
      emptyContent={<EmptyMilestones />}
      useSkeleton={true}
      skeletonContent={<MilestonesSkeleton />}
    >
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-4 md:p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{t('rewards.yourProgress')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('rewards.pointsEarned', { points: totalPoints })}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('rewards.availableRewards')}</h3>
              <p className="text-2xl font-bold">{availableRewards.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('rewards.completedMilestones')}</h3>
              <p className="text-2xl font-bold">{completedMilestones.length}</p>
            </div>
          </div>
        </div>
        
        {/* Milestones & Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Display available rewards */}
          {availableRewards.map((reward) => (
            <RewardCard
              key={reward.milestone_id}
              reward={reward}
              onClaim={claimReward}
              disabled={isProcessing}
            />
          ))}
          
          {/* Display milestones */}
          {milestones.map((milestone) => (
            <MilestoneCard 
              key={milestone.id}
              name={milestone.milestone_name}
              description={milestone.milestone_description || ''}
              icon={milestone.icon}
              pointsRequired={milestone.milestone?.points_required || 0}
              currentPoints={milestone.current_points}
              isCompleted={milestone.is_completed}
              rewardClaimed={milestone.reward_claimed}
              onClaimReward={milestone.is_completed && !milestone.reward_claimed ? 
                () => {
                  logger.info('User claiming reward', {
                    milestoneId: milestone.milestone_id,
                    milestoneName: milestone.milestone_name
                  });
                  return claimReward(milestone.milestone_id);
                } : undefined}
              isClaimingReward={isProcessing}
            />
          ))}
        </div>
      </div>
    </LoadingContent>
  );
};

export default MilestonesDashboard;
