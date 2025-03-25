
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormValues } from "./useQuestionnaireForm";

/**
 * Custom hook for questionnaire form validation
 * Separates validation logic from UI components and form state
 */
export function useQuestionnaireValidation(form: UseFormReturn<QuestionnaireFormValues>) {
  /**
   * Validates the business info step
   * @returns boolean indicating if validation passed
   */
  const validateBusinessInfoStep = () => {
    const { businessName, industry, businessDescription, serviceArea } = form.getValues();
    
    // Check for required fields
    if (!businessName || !industry || !businessDescription || !serviceArea) {
      form.trigger(["businessName", "industry", "businessDescription", "serviceArea"]);
      return false;
    }
    
    // Check business description length
    if (businessDescription.length < 50) {
      form.trigger("businessDescription");
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates the contact info step
   * @returns boolean indicating if validation passed
   */
  const validateContactInfoStep = () => {
    const { phoneNumber, email } = form.getValues();
    
    // Check for required fields
    if (!phoneNumber || !email) {
      form.trigger(["phoneNumber", "email"]);
      return false;
    }
    
    // Email validation via form schema
    const emailValid = form.getFieldState("email").invalid === false;
    if (!emailValid) {
      form.trigger("email");
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates the marketing goals step
   * @returns boolean indicating if validation passed
   */
  const validateMarketingGoalsStep = () => {
    const { marketingGoals } = form.getValues();
    
    // Check if at least one marketing goal is selected
    if (!marketingGoals || marketingGoals.length === 0) {
      form.trigger(["marketingGoals"]);
      return false;
    }
    
    return true;
  };
  
  return {
    validateBusinessInfoStep,
    validateContactInfoStep,
    validateMarketingGoalsStep
  };
}
