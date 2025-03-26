
import { useState, useCallback } from 'react';

/**
 * Creates a hook for managing form validation state
 * 
 * @param validateFn Function to validate form values
 * @returns Object with validation state and functions
 */
export function useFormValidation<T>(validateFn: (values: T) => Record<string, string>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const validate = useCallback((values: T): boolean => {
    setIsValidating(true);
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    setIsValidating(false);
    return Object.keys(validationErrors).length === 0;
  }, [validateFn]);
  
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouchedFields(current => {
      const updated = new Set(current);
      if (isTouched) {
        updated.add(field);
      } else {
        updated.delete(field);
      }
      return updated;
    });
  }, []);
  
  const getFieldError = useCallback((field: string): string | undefined => {
    if (touchedFields.has(field)) {
      return errors[field];
    }
    return undefined;
  }, [errors, touchedFields]);
  
  return {
    errors,
    isValidating,
    touchedFields,
    validate,
    clearErrors,
    setFieldTouched,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
}
