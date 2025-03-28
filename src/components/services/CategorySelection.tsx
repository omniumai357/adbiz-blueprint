
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useResponsive } from '@/hooks/useResponsive';

interface CategorySelectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelection = ({ selectedCategory, onCategoryChange }: CategorySelectionProps) => {
  const { toast } = useToast();
  const { isMobile } = useResponsive();
  
  const handleCategoryChange = (category: string) => {
    try {
      onCategoryChange(category);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error changing category';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Error changing category:", error);
    }
  };
  
  return (
    <div id="category-selection" className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Select a Package Type</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button 
          variant={selectedCategory === "monthly" ? "default" : "outline"}
          onClick={() => handleCategoryChange("monthly")}
          size={isMobile ? "sm" : "default"}
          className="flex-1 sm:flex-none min-w-[80px]"
        >
          Monthly
        </Button>
        <Button 
          variant={selectedCategory === "quarterly" ? "default" : "outline"}
          onClick={() => handleCategoryChange("quarterly")}
          size={isMobile ? "sm" : "default"}
          className="flex-1 sm:flex-none min-w-[80px]"
        >
          Quarterly
        </Button>
        <Button 
          variant={selectedCategory === "annual" ? "default" : "outline"}
          onClick={() => handleCategoryChange("annual")}
          size={isMobile ? "sm" : "default"}
          className="flex-1 sm:flex-none min-w-[80px]"
        >
          Annual
        </Button>
      </div>
    </div>
  );
};
