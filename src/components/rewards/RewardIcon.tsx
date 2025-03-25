
import React from 'react';
import { Award, Gift, Sparkles, ShoppingBag, DollarSign, MessageSquare, UserCheck } from 'lucide-react';

interface RewardIconProps {
  iconName?: string;
  className?: string;
  completed?: boolean;
}

/**
 * Component for displaying the appropriate icon for a reward
 * 
 * @param iconName - The name of the icon to display
 * @param className - Optional additional CSS classes
 * @param completed - Whether the milestone is completed
 */
const RewardIcon: React.FC<RewardIconProps> = ({ 
  iconName, 
  className = "h-6 w-6", 
  completed = false 
}) => {
  const colorClass = completed ? 'text-green-500' : 'text-primary';
  
  switch (iconName) {
    case 'shopping-bag':
      return <ShoppingBag className={`${className} ${colorClass}`} />;
    case 'award':
      return <Award className={`${className} ${completed ? 'text-amber-500' : 'text-amber-400'}`} />;
    case 'dollar-sign':
      return <DollarSign className={`${className} ${completed ? 'text-green-600' : 'text-green-500'}`} />;
    case 'message-square':
      return <MessageSquare className={`${className} ${completed ? 'text-blue-600' : 'text-blue-500'}`} />;
    case 'user-check':
      return <UserCheck className={`${className} ${completed ? 'text-violet-600' : 'text-violet-500'}`} />;
    default:
      return <Gift className={`${className} ${completed ? 'text-rose-600' : 'text-rose-500'}`} />;
  }
};

export default RewardIcon;
