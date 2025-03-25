
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CategorySelectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelection = ({ selectedCategory, onCategoryChange }: CategorySelectionProps) => {
  const { toast } = useToast();
  
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
    <div id="category-selection" className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select a Package Type</h2>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={selectedCategory === "monthly" ? "default" : "outline"}
          onClick={() => handleCategoryChange("monthly")}
        >
          Monthly
        </Button>
        <Button 
          variant={selectedCategory === "quarterly" ? "default" : "outline"}
          onClick={() => handleCategoryChange("quarterly")}
        >
          Quarterly
        </Button>
        <Button 
          variant={selectedCategory === "annual" ? "default" : "outline"}
          onClick={() => handleCategoryChange("annual")}
        >
          Annual
        </Button>
      </div>
    </div>
  );
};
