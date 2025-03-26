
/**
 * State Management Patterns
 * 
 * This file provides reusable patterns for managing state
 * across different features in a consistent way.
 */

import { useState, useCallback, useReducer } from 'react';

/**
 * Creates a reducer-based state management hook with typed actions
 * 
 * @param reducer The reducer function
 * @param initialState The initial state
 * @param actionCreators Object of action creator functions
 * @returns Tuple with state and action dispatchers
 */
export function createStoreHook<State, Actions extends Record<string, (...args: any[]) => any>>(
  reducer: (state: State, action: any) => State,
  initialState: State,
  actionCreators: Actions
) {
  return () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    // Create bound action dispatchers
    const boundActions = Object.entries(actionCreators).reduce(
      (acc, [key, actionCreator]) => {
        acc[key as keyof Actions] = (...args: any[]) => 
          dispatch(actionCreator(...args));
        return acc;
      }, 
      {} as { [K in keyof Actions]: (...args: Parameters<Actions[K]>) => void }
    );
    
    return [state, boundActions] as const;
  };
}

/**
 * Creates a simple boolean toggle hook
 * 
 * @param initialState The initial boolean state
 * @returns Tuple with state value and toggle function
 */
export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(s => !s), []);
  
  return [state, toggle] as const;
}

/**
 * Creates a hook for managing form step navigation
 * 
 * @param initialStep Initial step number
 * @param totalSteps Total number of steps
 * @returns Object with step navigation state and functions
 */
export function useFormSteps(initialStep: number = 1, totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(s => s + 1);
      return true;
    }
    return false;
  }, [currentStep, totalSteps, completedSteps]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      return true;
    }
    return false;
  }, [currentStep]);
  
  const markStepComplete = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps && !completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  }, [totalSteps, completedSteps]);
  
  const isStepComplete = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);
  
  return {
    currentStep,
    completedSteps,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    goToStep,
    nextStep,
    prevStep,
    markStepComplete,
    isStepComplete,
    progress: (completedSteps.length / totalSteps) * 100
  };
}

/**
 * Creates a hook for managing a collection of items
 * 
 * @param initialItems Initial collection of items
 * @returns Object with items array and functions to add, remove, update items
 */
export function useCollection<T extends { id: string }>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);
  
  const addItem = useCallback((item: T) => {
    setItems(current => [...current, item]);
  }, []);
  
  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);
  
  const updateItem = useCallback((id: string, updates: Partial<Omit<T, 'id'>>) => {
    setItems(current => 
      current.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);
  
  return { 
    items, 
    addItem, 
    removeItem, 
    updateItem,
    hasItem: useCallback((id: string) => items.some(item => item.id === id), [items]),
    clear: useCallback(() => setItems([]), [])
  };
}

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
