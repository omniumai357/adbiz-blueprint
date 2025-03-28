
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Target } from "lucide-react";
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
 * Enhanced MilestoneCard Component with standardized responsive design pattern
 * 
 * Features:
 * - Optimized layout for all device sizes
 * - Enhanced progress visualization
 * - Consistent spacing and typography
 * - Improved content hierarchies
 * - Touch-friendly interactive elements
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
  const { isMobile, isTablet, activeBreakpoint } = useResponsive();
  
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
    <Card className={`overflow-hidden border ${isCompleted ? 'border-green-200' : 'border-slate-200'} shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`} data-testid="milestone-card">
      <div className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
      
      <CardContent className={contentPadding}>
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <RewardIcon iconName={icon} completed={isCompleted} size={isMobile ? 'sm' : 'default'} />
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2 sm:line-clamp-3">{description}</p>
            
            {!isCompleted && (
              <div className="mt-4 space-y-2 w-full">
                <div className="flex justify-between text-sm mb-1" aria-hidden="true">
                  <span className="font-medium">{currentPoints} {t('points')}</span>
                  <span>{pointsRequired} {t('points')}</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-2.5 rounded-full" 
                    aria-label={t('progressInfo', { progress })} 
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                  
                  {/* Progress indicator - only shown on larger screens */}
                  {!isMobile && (
                    <span 
                      className="absolute text-xs font-medium text-primary" 
                      style={{ 
                        left: `${Math.min(Math.max(progress, 5), 95)}%`, 
                        top: '-1.25rem',
                        transform: 'translateX(-50%)'
                      }}
                      aria-hidden="true"
                    >
                      {progressText}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {progress < 100 ? (
                    <>
                      <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      <span>{t('pointsToGo', { points: pointsRemaining })}</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      <span>{t('completedMilestones')}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isCompleted && !rewardClaimed && (
        <CardFooter className="bg-muted/30 mt-auto" style={{ padding: footerPadding }}>
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
        <CardFooter className="bg-green-50 mt-auto" style={{ padding: footerPadding }}>
          <div className="w-full flex items-center justify-center gap-2 text-green-600 text-sm font-medium" role="status">
            <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{t('rewardClaimed')}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Also export as default for flexibility
export default MilestoneCard;
