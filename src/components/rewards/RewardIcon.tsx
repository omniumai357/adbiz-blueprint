
import React from 'react';
import { Trophy, Gift, Award, Medal, Star, Crown, Sparkles, LucideIcon, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

interface RewardIconProps {
  iconName?: string;
  completed?: boolean;
  className?: string;
  size?: IconSize;
}

/**
 * Component for displaying reward icons with standardized responsive styling
 * 
 * Features:
 * - Multiple size variants for responsive design
 * - Consistent styling for completed vs. incomplete state
 * - Fallback icon selection
 */
const RewardIcon: React.FC<RewardIconProps> = ({
  iconName = 'award',
  completed = false,
  className = '',
  size = 'default'
}) => {
  // Define size dimensions
  const sizeMap: Record<IconSize, { width: number, height: number }> = {
    xs: { width: 16, height: 16 },
    sm: { width: 20, height: 20 },
    default: { width: 24, height: 24 },
    lg: { width: 28, height: 28 },
    xl: { width: 32, height: 32 },
  };
  
  const dimensions = sizeMap[size];
  
  // Icon mapping
  const iconMap: Record<string, LucideIcon> = {
    trophy: Trophy,
    gift: Gift,
    award: Award,
    medal: Medal,
    star: Star,
    crown: Crown,
    sparkles: Sparkles,
    check: BadgeCheck,
    default: Award
  };

  // Select icon component - fallback to default if not found
  const IconComponent = iconMap[iconName.toLowerCase()] || iconMap.default;
  
  // Base classes for the icon container
  const baseClasses = 'rounded-full flex items-center justify-center';
  
  // Size and color classes
  const sizeClasses = {
    xs: 'p-1.5',
    sm: 'p-2',
    default: 'p-2.5',
    lg: 'p-3',
    xl: 'p-3.5'
  }[size];
  
  const containerClasses = completed
    ? 'bg-green-100 text-green-600'
    : 'bg-primary-100 text-primary';
    
  return (
    <div 
      className={cn(
        baseClasses,
        sizeClasses,
        containerClasses,
        className
      )}
      aria-hidden="true"
    >
      <IconComponent width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default RewardIcon;
