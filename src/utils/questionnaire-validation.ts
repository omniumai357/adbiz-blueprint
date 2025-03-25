
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormValues } from "@/hooks/useQuestionnaireForm";
import { toast } from "sonner";

/**
 * Field sets for each step of the questionnaire
 */
export const questionnaireFieldSets = {
  1: ["businessName", "industry", "businessDescription", "serviceArea"],
  2: ["phoneNumber", "email"],
  3: ["marketingGoals"],
};

/**
 * Validate the business info step
 */
export const validateBusinessInfoStep = (form: UseFormReturn<QuestionnaireFormValues>): boolean => {
  const { businessName, industry, businessDescription, serviceArea } = form.getValues();
  let isValid = true;
  
  // Check required fields
  if (!businessName || !industry || !businessDescription || !serviceArea) {
    form.trigger(["businessName", "industry", "businessDescription", "serviceArea"]);
    isValid = false;
  }
  
  // Check business description length
  if (businessDescription && businessDescription.length < 50) {
    form.trigger("businessDescription");
    isValid = false;
  }
  
  // Show error message if validation fails
  if (!isValid) {
    toast.error("Please complete all required fields", {
      description: "Make sure to provide all required business information."
    });
  }
  
  return isValid;
};

/**
 * Validate the contact info step
 */
export const validateContactInfoStep = (form: UseFormReturn<QuestionnaireFormValues>): boolean => {
  const { phoneNumber, email } = form.getValues();
  let isValid = true;
  
  // Check required fields
  if (!phoneNumber || !email) {
    form.trigger(["phoneNumber", "email"]);
    isValid = false;
  }
  
  // Email validation
  const emailValid = form.getFieldState("email").invalid === false;
  if (email && !emailValid) {
    form.trigger("email");
    isValid = false;
  }
  
  // Show error message if validation fails
  if (!isValid) {
    toast.error("Please complete all required fields", {
      description: "Make sure to provide valid contact information."
    });
  }
  
  return isValid;
};

/**
 * Validate the marketing goals step
 */
export const validateMarketingGoalsStep = (form: UseFormReturn<QuestionnaireFormValues>): boolean => {
  const { marketingGoals } = form.getValues();
  
  // Check if at least one goal is selected
  if (!marketingGoals || marketingGoals.length === 0) {
    form.trigger(["marketingGoals"]);
    
    toast.error("Marketing goals required", {
      description: "Please select at least one marketing goal."
    });
    
    return false;
  }
  
  return true;
};
