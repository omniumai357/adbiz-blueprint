
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import RewardIcon from './RewardIcon';
import { createComponentLogger } from '@/lib/utils/logging';

const logger = createComponentLogger('MilestoneCard');

interface MilestoneCardProps {
  name: string;
  description: string;
  icon?: string;
  pointsRequired: number;
  currentPoints: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
  onClaimReward?: () => void;
  isClaimingReward?: boolean;
}

/**
 * MilestoneCard Component
 * 
 * Displays a single milestone with progress and reward information
 * Enhanced with responsive layout and improved accessibility
 */
export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  name,
  description,
  icon,
  pointsRequired,
  currentPoints,
  isCompleted,
  rewardClaimed,
  onClaimReward,
  isClaimingReward = false
}) => {
  const { t } = useTranslation('rewards');
  const progress = Math.min(100, Math.round((currentPoints / pointsRequired) * 100));
  const pointsRemaining = pointsRequired - currentPoints;
  
  // Log milestone view for analytics
  React.useEffect(() => {
    logger.debug('Milestone card rendered', { 
      name, 
      isCompleted, 
      progress 
    });
  }, [name, isCompleted, progress]);
  
  const handleClaimReward = () => {
    if (onClaimReward) {
      logger.info('User claiming milestone reward', { milestoneName: name });
      onClaimReward();
    }
  };
  
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4" data-i18n-section>
          <div className="flex-shrink-0">
            <RewardIcon iconName={icon} completed={isCompleted} />
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="font-semibold text-base sm:text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2 sm:line-clamp-none">{description}</p>
            
            {!isCompleted && (
              <div className="mt-4 space-y-2 w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentPoints} {t('points', 'points')}</span>
                  <span>{pointsRequired} {t('points', 'points')}</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2" 
                  aria-label={t('progressInfo', '{{progress}}% complete', { progress })} 
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{t('pointsToGo', { points: pointsRemaining })}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isCompleted && !rewardClaimed && (
        <CardFooter className="bg-muted/30 px-4 py-3 sm:px-6">
          <Button 
            onClick={handleClaimReward} 
            disabled={isClaimingReward}
            className="w-full"
            variant="default"
            aria-label={t('claimRewardAriaLabel', 'Claim your reward for completing {{name}}', { name })}
          >
            {isClaimingReward ? t('processing', 'Processing...') : t('claimReward')}
          </Button>
        </CardFooter>
      )}
      
      {isCompleted && rewardClaimed && (
        <CardFooter className="bg-green-50 px-4 py-3 sm:px-6">
          <div className="w-full flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>{t('rewardClaimed')}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Also export as default for flexibility
export default MilestoneCard;
