
import { UseFormReturn } from "react-hook-form";
import { showValidationErrors } from "@/utils/form-validation";

/**
 * Hook for handling form validation with improved error handling
 */
export function useFormValidation(form: UseFormReturn<any>) {
  /**
   * Validate specific fields and show error messages
   */
  const validateFields = async (fieldNames: string[]): Promise<boolean> => {
    // Trigger validation for all specified fields
    const result = await form.trigger(fieldNames);
    
    if (!result) {
      // Get errors for the specified fields
      const errors: Record<string, string> = {};
      
      fieldNames.forEach(name => {
        const error = form.getFieldState(name).error;
        if (error) {
          errors[name] = error.message || `Invalid ${name}`;
        }
      });
      
      // Show validation errors in UI
      showValidationErrors(errors);
    }
    
    return result;
  };
  
  /**
   * Validate a form step with specific field sets
   */
  const validateFormStep = async (step: number, fieldSets: Record<number, string[]>): Promise<boolean> => {
    const fieldsToValidate = fieldSets[step] || [];
    
    if (fieldsToValidate.length === 0) {
      return true;
    }
    
    return await validateFields(fieldsToValidate);
  };
  
  return {
    validateFields,
    validateFormStep
  };
}
