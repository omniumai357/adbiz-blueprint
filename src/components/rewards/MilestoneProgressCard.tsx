
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Medal, Award, Gift } from "lucide-react";
import { createComponentLogger } from "@/lib/utils/logging";
import { useResponsive } from "@/hooks/useResponsive";

const logger = createComponentLogger('MilestoneProgressCard');

interface MilestoneProgressCardProps {
  totalPoints: number;
  completedMilestones: number;
  availableRewards: number;
  isCompact?: boolean;
}

/**
 * MilestoneProgressCard - Enhanced with optimized responsive design
 * 
 * Features:
 * - Dynamic layout adjustments for all screen sizes
 * - Optimized spacing and typography for readability
 * - Smooth transitions between layouts
 * - Conditional rendering of content based on available space
 * - Performance optimized with selective rendering
 */
const MilestoneProgressCard: React.FC<MilestoneProgressCardProps> = ({
  totalPoints,
  completedMilestones,
  availableRewards,
  isCompact = false
}) => {
  const { t } = useTranslation('rewards');
  const { isMobile, isTablet, activeBreakpoint } = useResponsive();
  
  useEffect(() => {
    logger.debug('MilestoneProgressCard rendered', {
      totalPoints,
      completedMilestones,
      availableRewards,
      isCompact,
      breakpoint: activeBreakpoint
    });
  }, [totalPoints, completedMilestones, availableRewards, isCompact, activeBreakpoint]);
  
  // Dynamic classes based on screen size and compact mode
  const cardPadding = isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5 md:p-6';
  const titleClass = isCompact ? 'text-lg' : 'text-xl';
  const statItemClass = `flex flex-col items-center justify-center p-3 ${isMobile ? 'py-2.5' : 'p-3'} rounded-lg`;
  
  return (
    <Card className={`bg-gradient-to-r from-slate-50 to-white border shadow-sm ${cardPadding}`}>
      <CardContent className="p-0">
        <h2 className={`${titleClass} font-semibold mb-1 sm:mb-2`}>
          {t('yourProgress')}
        </h2>
        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
          {t('pointsEarned', { points: totalPoints })}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className={`${statItemClass} bg-primary/5`}>
            <Medal className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary mb-1`} aria-hidden="true" />
            <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
            <p className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold`}>{totalPoints}</p>
          </div>
          
          <div className={`${statItemClass} bg-green-50`}>
            <Award className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-green-500 mb-1`} aria-hidden="true" />
            <p className="text-xs text-muted-foreground">{t('completedMilestones')}</p>
            <p className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold`}>{completedMilestones}</p>
          </div>
          
          {(!isCompact || !isMobile) && (
            <div className={`${statItemClass} bg-amber-50 ${
              isMobile && isTablet ? 'col-span-2 md:col-span-1' : ''
            }`}>
              <Gift className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-amber-500 mb-1`} aria-hidden="true" />
              <p className="text-xs text-muted-foreground">{t('availableRewards')}</p>
              <p className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold`}>{availableRewards}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneProgressCard;
