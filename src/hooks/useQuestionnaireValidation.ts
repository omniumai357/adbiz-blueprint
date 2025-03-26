
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormValues } from "./useQuestionnaireForm";
import { toast } from "sonner";
import { useFormValidation } from "@/patterns/state-management";

/**
 * Custom hook for questionnaire form validation
 * Separates validation logic from UI components and form state
 */
export function useQuestionnaireValidation(form: UseFormReturn<QuestionnaireFormValues>) {
  // Map form values to validation state
  const validateForm = (values: QuestionnaireFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Business info validation
    if (!values.businessName) {
      errors.businessName = "Business name is required";
    }
    
    if (!values.industry) {
      errors.industry = "Industry is required";
    }
    
    if (!values.businessDescription) {
      errors.businessDescription = "Business description is required";
    } else if (values.businessDescription.length < 50) {
      errors.businessDescription = "Please provide at least 50 characters";
    }
    
    if (!values.serviceArea) {
      errors.serviceArea = "Service area is required";
    }
    
    // Contact info validation
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    
    // Marketing goals validation
    if (!values.marketingGoals || values.marketingGoals.length === 0) {
      errors.marketingGoals = "Please select at least one marketing goal";
    }
    
    return errors;
  };
  
  // Use our custom validation hook
  const validation = useFormValidation<QuestionnaireFormValues>(validateForm);
  
  /**
   * Validates the business info step
   * @returns boolean indicating if validation passed
   */
  const validateBusinessInfoStep = () => {
    const { businessName, industry, businessDescription, serviceArea } = form.getValues();
    
    // Check for required fields
    if (!businessName || !industry || !businessDescription || !serviceArea) {
      form.trigger(["businessName", "industry", "businessDescription", "serviceArea"]);
      
      // Show toast if validation fails
      toast.error("Please complete all required fields", {
        description: "Make sure to provide all required business information."
      });
      
      return false;
    }
    
    // Check business description length
    if (businessDescription.length < 50) {
      form.trigger("businessDescription");
      
      toast.error("Business description too short", {
        description: "Please provide at least 50 characters for your business description."
      });
      
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
      
      toast.error("Please complete all required fields", {
        description: "Make sure to provide valid contact information."
      });
      
      return false;
    }
    
    // Email validation via form schema
    const emailValid = form.getFieldState("email").invalid === false;
    if (!emailValid) {
      form.trigger("email");
      
      toast.error("Invalid email address", {
        description: "Please provide a valid email address."
      });
      
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
      
      toast.error("Marketing goals required", {
        description: "Please select at least one marketing goal."
      });
      
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates the entire form at once
   * Useful for the review step or form submission
   */
  const validateEntireForm = () => {
    return validation.validate(form.getValues());
  };
  
  return {
    ...validation,
    validateBusinessInfoStep,
    validateContactInfoStep,
    validateMarketingGoalsStep,
    validateEntireForm
  };
}
