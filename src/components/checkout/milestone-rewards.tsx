
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Check, ChevronRight } from "lucide-react";
import { CommonMilestoneData, UserMilestone as ApiUserMilestone } from "@/types/api";
import { useMilestones, UserMilestone } from "@/hooks/rewards/useMilestones";

interface MilestoneRewardsProps {
  userId: string | null;
  onRewardApplied: (reward: UserMilestone | CommonMilestoneData) => void;
  appliedReward: UserMilestone | CommonMilestoneData | null;
}

const MilestoneRewards = ({
  userId,
  onRewardApplied,
  appliedReward
}: MilestoneRewardsProps) => {
  const { availableRewards, isLoading, claimReward } = useMilestones(userId);
  const { toast } = useToast();

  const handleApplyReward = async (reward: CommonMilestoneData) => {
    if (appliedReward) {
      toast({
        description: "You can only apply one reward per order",
      });
      return;
    }

    onRewardApplied(reward as UserMilestone);
    
    toast({
      title: "Reward Applied!",
      description: `${reward.reward_value}${reward.reward_type === 'discount_percentage' ? '%' : '$'} discount has been applied to your order.`,
    });
  };

  if (!userId) return null;

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Milestone Rewards
          </CardTitle>
          <CardDescription>Loading your rewards...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (availableRewards.length === 0 && !appliedReward) {
    return null;
  }

  return (
    <Card className="mb-4 bg-gradient-to-r from-slate-50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Milestone Rewards
        </CardTitle>
        <CardDescription>
          {appliedReward 
            ? "You have applied a milestone reward to this order" 
            : "You have milestone rewards available to use"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appliedReward ? (
          <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-medium">{appliedReward.milestone_name}</p>
                <p className="text-sm text-muted-foreground">
                  {appliedReward.reward_value}{appliedReward.reward_type === 'discount_percentage' ? '%' : '$'} discount applied
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50">Applied</Badge>
          </div>
        ) : (
          <div className="space-y-3">
            {availableRewards.slice(0, 3).map((reward) => (
              <div key={reward.milestone_id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div>
                  <p className="font-medium">{reward.milestone_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reward.reward_value}{reward.reward_type === 'discount_percentage' ? '%' : '$'} discount available
                  </p>
                </div>
                <Button 
                  onClick={() => handleApplyReward(reward)} 
                  variant="outline" 
                  size="sm"
                >
                  Apply
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {availableRewards.length > 3 && (
              <p className="text-sm text-center text-muted-foreground">
                +{availableRewards.length - 3} more rewards available
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneRewards;
