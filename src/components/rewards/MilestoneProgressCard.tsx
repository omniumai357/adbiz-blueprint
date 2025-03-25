
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { MilestoneProgress } from '@/types/api';
import RewardIcon from './RewardIcon';

interface MilestoneProgressCardProps {
  milestone: MilestoneProgress;
}

/**
 * Renders a card displaying a user's progress toward a milestone
 * 
 * Shows:
 * - Milestone name with an appropriate icon
 * - Current progress (points earned vs. points required)
 * - Visual progress bar
 * 
 * @param milestone - The milestone progress data to display
 */
const MilestoneProgressCard: React.FC<MilestoneProgressCardProps> = ({ milestone }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {milestone.icon ? (
              <RewardIcon iconName={milestone.icon} className="h-5 w-5" />
            ) : (
              <Star className="h-5 w-5 text-yellow-500" />
            )}
            <CardTitle className="text-lg">{milestone.milestone_name}</CardTitle>
          </div>
          <div className="text-sm font-medium">
            {milestone.current_points} / {milestone.points_required} points
          </div>
        </div>
        <CardDescription>
          {milestone.progress_percentage === 100 
            ? 'Completed!' 
            : `${milestone.progress_percentage}% complete`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress 
          value={milestone.progress_percentage} 
          className={`h-2 ${milestone.progress_percentage === 100 ? 'bg-primary/20' : 'bg-slate-100'}`}
        />
      </CardContent>
    </Card>
  );
};

export default MilestoneProgressCard;
