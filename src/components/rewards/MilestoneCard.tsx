
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import RewardIcon from './RewardIcon';

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
  const progress = Math.min(100, Math.round((currentPoints / pointsRequired) * 100));
  const pointsRemaining = pointsRequired - currentPoints;
  
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
      <CardContent className="p-6">
        <div className="flex flex-row items-start gap-4">
          <RewardIcon iconName={icon} completed={isCompleted} />
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
            
            {!isCompleted && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentPoints} points</span>
                  <span>{pointsRequired} points</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{pointsRemaining} points to go</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isCompleted && !rewardClaimed && (
        <CardFooter className="bg-muted/30 px-6 py-3">
          <Button 
            onClick={onClaimReward} 
            disabled={isClaimingReward}
            className="w-full"
            variant="default"
          >
            {isClaimingReward ? "Processing..." : "Claim Reward"}
          </Button>
        </CardFooter>
      )}
      
      {isCompleted && rewardClaimed && (
        <CardFooter className="bg-green-50 px-6 py-3">
          <div className="w-full flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Reward Claimed</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
