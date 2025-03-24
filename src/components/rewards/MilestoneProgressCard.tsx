
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, ShoppingBag, DollarSign, MessageSquare, UserCheck, Star } from 'lucide-react';
import { MilestoneProgress } from '@/hooks/rewards/useMilestones';

interface MilestoneProgressCardProps {
  milestone: MilestoneProgress;
}

const MilestoneProgressCard: React.FC<MilestoneProgressCardProps> = ({ milestone }) => {
  // Map milestone icons to Lucide React components
  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'shopping-bag':
        return <ShoppingBag className="h-5 w-5 text-primary" />;
      case 'award':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'dollar-sign':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'message-square':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'user-check':
        return <UserCheck className="h-5 w-5 text-violet-500" />;
      default:
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(milestone.icon)}
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
