
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

export function useMarketingGoalsForm() {
  const { form } = useQuestionnaireContext();
  
  // Get form values for marketing goals
  const marketingGoals = form.watch("marketingGoals") || [];
  
  // Helper to check if a goal is selected
  const isGoalSelected = (goalValue: string) => marketingGoals.includes(goalValue);
  
  // Calculate form completeness for this section
  const hasSelectedGoals = marketingGoals.length > 0;
  
  return {
    form,
    marketingGoals,
    isGoalSelected,
    hasSelectedGoals
  };
}
