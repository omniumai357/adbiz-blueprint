
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import { useCallback } from "react";

export function useMarketingGoalsForm() {
  const { form } = useQuestionnaireContext();
  
  // Get form values for marketing goals
  const marketingGoals = form.watch("marketingGoals") || [];
  
  // Helper to check if a goal is selected
  const isGoalSelected = useCallback((goalValue: string) => {
    return marketingGoals.includes(goalValue);
  }, [marketingGoals]);
  
  // Function to toggle a marketing goal selection
  const toggleGoalSelection = useCallback((goalValue: string) => {
    const currentGoals = [...marketingGoals];
    const goalIndex = currentGoals.indexOf(goalValue);
    
    if (goalIndex === -1) {
      // Add goal if not already selected
      form.setValue("marketingGoals", [...currentGoals, goalValue], { 
        shouldValidate: true,
        shouldDirty: true 
      });
    } else {
      // Remove goal if already selected
      currentGoals.splice(goalIndex, 1);
      form.setValue("marketingGoals", currentGoals, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    }
  }, [form, marketingGoals]);
  
  // Calculate form completeness for this section
  const hasSelectedGoals = marketingGoals.length > 0;
  
  return {
    form,
    marketingGoals,
    isGoalSelected,
    toggleGoalSelection,
    hasSelectedGoals
  };
}
