
import { useQuestionnaireForm } from './questionnaire/useQuestionnaireForm';
import { marketingGoalOptions, QuestionnaireFormValues } from './questionnaire/useQuestionnaireSchema';

// Re-export the hook and types for backward compatibility
export { useQuestionnaireForm };
export { marketingGoalOptions, type QuestionnaireFormValues };

// Export the refactored hook with the original name for backward compatibility
export function useQuestionnaireFormRefactored(onComplete?: (data: any) => void) {
  return useQuestionnaireForm(onComplete);
}
