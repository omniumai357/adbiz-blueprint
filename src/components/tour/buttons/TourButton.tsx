
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';
import { useMobileTourInteractions } from '@/hooks/tour/useMobileTourInteractions';

interface TourButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isCompact?: boolean;
}

/**
 * TourButton Component
 * 
 * A responsive button optimized for tour interactions.
 * Adjusts size and touch targets based on device.
 */
export const TourButton: React.FC<TourButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isCompact = false,
  disabled,
  ...props
}) => {
  const { isMobile, isTablet } = useResponsiveTour();
  const { touchSizeStyles, hasTouchCapability } = useMobileTourInteractions();
  
  // Generate button styles based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      case 'outline':
        return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
      case 'ghost':
        return 'hover:bg-accent hover:text-accent-foreground';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };
  
  // Generate size classes
  const getSizeClasses = () => {
    // Use larger touch targets for touch devices
    if ((isMobile || isTablet) && hasTouchCapability) {
      return isCompact 
        ? 'text-xs py-1.5 px-2.5' 
        : 'text-sm py-2.5 px-4';
    }
    
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-2';
      case 'lg':
        return 'text-base py-2.5 px-5';
      case 'md':
      default:
        return 'text-sm py-1.5 px-3';
    }
  };
  
  // Get icon styles
  const iconClasses = cn(
    'inline-flex items-center',
    iconPosition === 'left' ? 'mr-2' : 'ml-2'
  );
  
  return (
    <button
      className={cn(
        'rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'flex items-center justify-center font-medium',
        getVariantClasses(),
        getSizeClasses(),
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled}
      style={hasTouchCapability ? touchSizeStyles : undefined}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={iconClasses}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={iconClasses}>{icon}</span>
      )}
    </button>
  );
};
