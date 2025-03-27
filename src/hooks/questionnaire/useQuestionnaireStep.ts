
import { UseFormReturn } from "react-hook-form";
import { useQuestionnaireSteps } from "@/hooks/useQuestionnaireSteps";
import { 
  validateBusinessInfoStep, 
  validateContactInfoStep,
  validateMarketingGoalsStep
} from "@/utils/questionnaire-validation";
import { QuestionnaireFormValues } from "./useQuestionnaireSchema";
import { logger } from '@/utils/logger';

export function useQuestionnaireStep(form: UseFormReturn<QuestionnaireFormValues>) {
  const { step, showReview, nextStep, prevStep, onShowReview } = useQuestionnaireSteps(1);
  
  logger.debug('Initializing questionnaire step handler', { currentStep: step });

  const handleBusinessInfoNext = (validateOnly = false) => {
    if (validateBusinessInfoStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleBrandingContactNext = (validateOnly = false) => {
    if (validateContactInfoStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleMarketingGoalsNext = (validateOnly = false) => {
    if (validateMarketingGoalsStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleFileUploadNext = () => {
    nextStep();
  };

  return {
    step,
    showReview,
    nextStep,
    prevStep,
    onShowReview,
    handleBusinessInfoNext,
    handleBrandingContactNext,
    handleMarketingGoalsNext,
    handleFileUploadNext,
  };
}
