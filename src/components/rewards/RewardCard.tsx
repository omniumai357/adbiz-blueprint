
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { CommonMilestoneData } from '@/types/api';
import RewardIcon from './RewardIcon';
import { createComponentLogger } from '@/lib/utils/logging';
import { useResponsive } from '@/hooks/useResponsive';

const logger = createComponentLogger('RewardCard');

interface RewardCardProps {
  reward: CommonMilestoneData;
  onClaim: (milestoneId: string) => Promise<any>;
  disabled?: boolean;
}

/**
 * Renders a card displaying a reward the user has earned
 * 
 * Shows:
 * - Reward name with an appropriate icon
 * - Reward value (discount percentage or amount)
 * - Date the milestone was achieved
 * - Button to claim the reward
 * 
 * Enhanced with responsive design and logging
 * 
 * @param reward - The reward data to display
 * @param onClaim - Function to call when the user claims the reward
 * @param disabled - Whether the claim button should be disabled
 */
const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaim, disabled = false }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  
  /**
   * Handles the user clicking the claim button
   * Calls the onClaim function with the milestone ID
   */
  const handleClaim = async () => {
    if (!disabled) {
      logger.info('User claiming reward', {
        milestoneId: reward.milestone_id,
        milestoneName: reward.milestone_name
      });
      try {
        await onClaim(reward.milestone_id);
        logger.info('Reward claimed successfully');
      } catch (error) {
        logger.error('Error claiming reward', error);
      }
    }
  };

  // Format the completion date if available
  const completedDate = 'completed_at' in reward && reward.completed_at ? 
    format(new Date(reward.completed_at as string), 'MMM d, yyyy') : '';
  
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader className={isMobile ? "pb-1 px-4" : "pb-2"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RewardIcon iconName={reward.icon} />
            <CardTitle className={isMobile ? "text-base" : "text-lg"}>{reward.milestone_name}</CardTitle>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {reward.reward_value}{reward.reward_type === 'discount_percentage' ? '%' : '$'} Discount
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {completedDate && `Achieved on ${completedDate}`}
        </p>
      </CardHeader>
      <CardContent className={isMobile ? "pb-2 px-4" : ""}>
        <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">{reward.milestone_description}</p>
      </CardContent>
      <CardFooter className={isMobile ? "pt-2 pb-4 px-4" : ""}>
        <Button 
          onClick={handleClaim}
          disabled={disabled || reward.is_claimed}
          variant="default"
          className="w-full"
          size={isMobile ? "sm" : "default"}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {reward.is_claimed ? t('rewards.claimed') : t('rewards.claimReward')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
