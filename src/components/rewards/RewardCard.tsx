
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
 * Features:
 * - Standardized responsive design pattern
 * - Optimized for all device sizes with appropriate spacing
 * - Clear visual hierarchy with consistent typography
 * - Touch-friendly interaction targets
 * - Proper text truncation and overflow handling
 */
const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaim, disabled = false }) => {
  const { t } = useTranslation('rewards');
  const { isMobile, isTablet } = useResponsive();
  
  // Handle claim button interaction
  const handleClaim = async () => {
    if (!disabled) {
      logger.info('User claiming reward', {
        milestoneId: reward.milestone_id,
        milestoneName: reward.milestone_name,
        deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
      });
      
      try {
        await onClaim(reward.milestone_id);
        logger.info('Reward claimed successfully');
      } catch (error) {
        logger.error('Error claiming reward', error);
      }
    }
  };

  // Format the completion date with proper fallback
  const completedDate = 'completed_at' in reward && reward.completed_at ? 
    format(new Date(reward.completed_at as string), 'MMM d, yyyy') : '';
  
  // Determine appropriate spacing based on device size
  const headerPadding = isMobile ? "pb-2 pt-3 px-3 sm:px-4" : "pb-3 pt-4";
  const contentPadding = isMobile ? "py-2 px-3 sm:px-4" : "py-3";
  const footerPadding = isMobile ? "pt-2 pb-3 px-3 sm:px-4" : "pt-3 pb-4";
  
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-md hover:shadow-lg transition-all h-full flex flex-col">
      <CardHeader className={headerPadding}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink min-w-0">
            <RewardIcon iconName={reward.icon} className="flex-shrink-0" />
            <CardTitle className={`${isMobile ? "text-base" : "text-lg"} truncate`}>
              {reward.milestone_name}
            </CardTitle>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
            {reward.reward_value}{reward.reward_type === 'discount_percentage' ? '%' : '$'} {t('discount')}
          </div>
        </div>
        {completedDate && (
          <p className="text-xs text-muted-foreground mt-1">
            {t('achievedOn', { date: completedDate })}
          </p>
        )}
      </CardHeader>
      
      <CardContent className={contentPadding}>
        <p className={`text-sm ${isMobile ? "line-clamp-2" : ""}`}>
          {reward.milestone_description || t('noDescription')}
        </p>
      </CardContent>
      
      <CardFooter className={`${footerPadding} mt-auto`}>
        <Button 
          onClick={handleClaim}
          disabled={disabled || reward.is_claimed}
          variant="default"
          className="w-full transition-all"
          size={isMobile ? "sm" : "default"}
          aria-label={reward.is_claimed 
            ? t('alreadyClaimed') 
            : t('claimRewardAriaLabel', { name: reward.milestone_name })}
        >
          <Sparkles className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} mr-2`} />
          {reward.is_claimed ? t('claimed') : t('claimReward')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
