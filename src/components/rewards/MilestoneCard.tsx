
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import RewardIcon from './RewardIcon';
import { createComponentLogger } from '@/lib/utils/logging';
import { useResponsive } from '@/hooks/useResponsive';

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
 * Enhanced MilestoneCard Component
 * 
 * Displays a single milestone with progress and reward information
 * Features:
 * - Fully responsive layout with optimized spacing
 * - Enhanced progress visualization with percentage indicator
 * - Improved content hierarchies for different screen sizes
 * - Optimized touch targets for mobile users
 * - Performance optimizations with memoized calculations
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
  const { isMobile, isTablet } = useResponsive();
  
  // Memoize calculations for better performance
  const { progress, pointsRemaining, progressText } = useMemo(() => {
    const calculatedProgress = Math.min(100, Math.round((currentPoints / Math.max(1, pointsRequired)) * 100));
    const remaining = Math.max(0, pointsRequired - currentPoints);
    return { 
      progress: calculatedProgress, 
      pointsRemaining: remaining,
      progressText: `${calculatedProgress}%`
    };
  }, [currentPoints, pointsRequired]);
  
  // Log milestone view for analytics
  React.useEffect(() => {
    logger.debug('Milestone card rendered', { 
      name, 
      isCompleted, 
      progress,
      device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    });
  }, [name, isCompleted, progress, isMobile, isTablet]);
  
  const handleClaimReward = () => {
    if (onClaimReward) {
      logger.info('User claiming milestone reward', { milestoneName: name });
      onClaimReward();
    }
  };
  
  // Determine appropriate spacing based on device size
  const contentPadding = isMobile ? "p-3 sm:p-4" : "p-4 sm:p-6";
  const footerPadding = isMobile ? "px-3 py-3 sm:px-4" : "px-4 py-3 sm:px-6";
  
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
      
      <CardContent className={contentPadding}>
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <RewardIcon iconName={icon} completed={isCompleted} />
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2 sm:line-clamp-3">{description}</p>
            
            {!isCompleted && (
              <div className="mt-4 space-y-2 w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{currentPoints} {t('points')}</span>
                  <span>{pointsRequired} {t('points')}</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-2.5 rounded-full" 
                    aria-label={t('progressInfo', { progress })} 
                  />
                  {isTablet && (
                    <span className="absolute text-xs font-medium -top-0.5 text-primary" style={{ left: `${Math.min(90, progress)}%` }}>
                      {progressText}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{t('pointsToGo', { points: pointsRemaining })}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isCompleted && !rewardClaimed && (
        <CardFooter className="bg-muted/30 px-4 py-3 sm:px-6 mt-auto">
          <Button 
            onClick={handleClaimReward} 
            disabled={isClaimingReward}
            className="w-full"
            variant="default"
            size={isMobile ? "sm" : "default"}
            aria-label={t('claimRewardAriaLabel', { name })}
          >
            {isClaimingReward ? t('processing') : t('claimReward')}
          </Button>
        </CardFooter>
      )}
      
      {isCompleted && rewardClaimed && (
        <CardFooter className="bg-green-50 px-4 py-3 sm:px-6 mt-auto">
          <div className="w-full flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t('rewardClaimed')}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Also export as default for flexibility
export default MilestoneCard;
