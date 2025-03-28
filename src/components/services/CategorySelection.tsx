
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface CategorySelectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  className?: string;
}

/**
 * CategorySelection component - Horizontal list of category options
 * 
 * Displays selectable category options with responsive layout adjustments.
 * Adapts to mobile, tablet, and desktop views automatically.
 */
export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onCategoryChange,
  categories = [
    { id: 'monthly', name: 'Monthly Plans' },
    { id: 'custom', name: 'Custom Plans' },
    { id: 'platinum', name: 'Platinum Service' }
  ],
  className
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  // Adjust the button size for different screen sizes
  const buttonSize = isMobile ? 'py-2 px-3 text-sm' : 'py-2.5 px-4';
  
  return (
    <div className={cn("mb-8", className)}>
      <div className="mb-3">
        <h2 className="text-lg sm:text-xl font-semibold">
          Package Categories
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a category to view available packages
        </p>
      </div>
      
      <div className={cn(
        "flex",
        isMobile ? "flex-wrap gap-2" : "gap-3"
      )}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "rounded-full transition-colors",
              buttonSize,
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
            aria-pressed={selectedCategory === category.id}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
