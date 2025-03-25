
import React from 'react';
import { Award, Gift, Sparkles, ShoppingBag, DollarSign, MessageSquare, UserCheck } from 'lucide-react';

interface RewardIconProps {
  iconName?: string;
  className?: string;
}

/**
 * Component for displaying the appropriate icon for a reward
 * 
 * @param iconName - The name of the icon to display
 * @param className - Optional additional CSS classes
 */
const RewardIcon: React.FC<RewardIconProps> = ({ iconName, className = "h-6 w-6" }) => {
  switch (iconName) {
    case 'shopping-bag':
      return <ShoppingBag className={`${className} text-primary`} />;
    case 'award':
      return <Award className={`${className} text-amber-500`} />;
    case 'dollar-sign':
      return <DollarSign className={`${className} text-green-500`} />;
    case 'message-square':
      return <MessageSquare className={`${className} text-blue-500`} />;
    case 'user-check':
      return <UserCheck className={`${className} text-violet-500`} />;
    default:
      return <Gift className={`${className} text-rose-500`} />;
  }
};

export default RewardIcon;
