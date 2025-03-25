
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, Sparkles, ShoppingBag, DollarSign, MessageSquare, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { CommonMilestoneData } from '@/types/api';

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
 * @param reward - The reward data to display
 * @param onClaim - Function to call when the user claims the reward
 * @param disabled - Whether the claim button should be disabled
 */
const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaim, disabled = false }) => {
  /**
   * Maps icon names to Lucide React components
   * 
   * @param iconName - The name of the icon to display
   * @returns The appropriate icon component
   */
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'shopping-bag':
        return <ShoppingBag className="h-6 w-6 text-primary" />;
      case 'award':
        return <Award className="h-6 w-6 text-amber-500" />;
      case 'dollar-sign':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'message-square':
        return <MessageSquare className="h-6 w-6 text-blue-500" />;
      case 'user-check':
        return <UserCheck className="h-6 w-6 text-violet-500" />;
      default:
        return <Gift className="h-6 w-6 text-rose-500" />;
    }
  };

  /**
   * Handles the user clicking the claim button
   * Calls the onClaim function with the milestone ID
   */
  const handleClaim = async () => {
    if (!disabled) {
      onClaim(reward.milestone_id);
    }
  };

  // Format the completion date if available
  const completedDate = 'completed_at' in reward && reward.completed_at ? 
    format(new Date(reward.completed_at), 'MMM d, yyyy') : '';
  
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(reward.icon)}
            <CardTitle className="text-lg">{reward.milestone_name}</CardTitle>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {reward.reward_value}{reward.reward_type === 'discount_percentage' ? '%' : '$'} Discount
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {completedDate && `Achieved on ${completedDate}`}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{reward.milestone_description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleClaim}
          disabled={disabled || reward.is_claimed}
          variant="default"
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {reward.is_claimed ? 'Claimed' : 'Claim Reward'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
