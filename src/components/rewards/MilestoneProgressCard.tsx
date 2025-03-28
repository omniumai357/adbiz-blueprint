
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Medal, Award, Gift } from "lucide-react";
import { createComponentLogger } from "@/lib/utils/logging";

const logger = createComponentLogger('MilestoneProgressCard');

interface MilestoneProgressCardProps {
  totalPoints: number;
  completedMilestones: number;
  availableRewards: number;
  isCompact?: boolean;
}

/**
 * MilestoneProgressCard
 * 
 * Displays a user's overall milestone progress and reward status
 * Fully responsive with optimized layouts for different screen sizes
 */
const MilestoneProgressCard: React.FC<MilestoneProgressCardProps> = ({
  totalPoints,
  completedMilestones,
  availableRewards,
  isCompact = false
}) => {
  const { t } = useTranslation('rewards');
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1023px)");
  
  useEffect(() => {
    logger.debug('MilestoneProgressCard rendered', {
      totalPoints,
      completedMilestones,
      availableRewards,
      isCompact,
      isMobile
    });
  }, [totalPoints, completedMilestones, availableRewards, isCompact, isMobile]);
  
  return (
    <Card className={`bg-gradient-to-r from-slate-50 to-white border shadow-sm ${isCompact ? 'p-3' : 'p-4 md:p-6'}`}>
      <CardContent className={`${isCompact ? 'p-0' : 'p-0'}`}>
        <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold mb-2`}>
          {t('yourProgress')}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t('pointsEarned', { points: totalPoints })}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5">
            <Medal className="h-6 w-6 text-primary mb-1" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
            <p className="text-lg md:text-xl font-bold">{totalPoints}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-50">
            <Award className="h-6 w-6 text-green-500 mb-1" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">{t('completedMilestones')}</p>
            <p className="text-lg md:text-xl font-bold">{completedMilestones}</p>
          </div>
          
          {(!isCompact || !isMobile) && (
            <div className={`flex flex-col items-center justify-center p-3 rounded-lg bg-amber-50 ${
              isMobile || isTablet ? 'col-span-2 md:col-span-1' : ''
            }`}>
              <Gift className="h-6 w-6 text-amber-500 mb-1" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">{t('availableRewards')}</p>
              <p className="text-lg md:text-xl font-bold">{availableRewards}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneProgressCard;
