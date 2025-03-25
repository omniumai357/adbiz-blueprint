
import { ZodIssue } from "zod";
import { toast } from "sonner";

/**
 * Extract error messages from zod validation issues
 */
export const extractZodErrors = (
  issues: ZodIssue[]
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  
  return errors;
};

/**
 * Display form validation errors as toast notifications
 */
export const showValidationErrors = (errors: Record<string, string>) => {
  const errorMessages = Object.values(errors);
  
  if (errorMessages.length > 0) {
    // Show the first error in a toast
    toast.error("Form Validation Error", {
      description: errorMessages[0]
    });
    
    // Log all errors to console for debugging
    console.log("Validation errors:", errors);
  }
};

/**
 * Validate and mark fields as touched
 */
export const validateAndMarkFields = (
  form: any, 
  fieldNames: string[]
): boolean => {
  // Trigger validation for all specified fields
  form.trigger(fieldNames);
  
  // Check if any of the fields have errors
  const hasErrors = fieldNames.some(
    name => !!form.formState.errors[name]
  );
  
  return !hasErrors;
};
