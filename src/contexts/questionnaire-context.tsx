
import React, { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormValues } from '@/hooks/useQuestionnaireForm';

interface QuestionnaireContextType {
  form: UseFormReturn<QuestionnaireFormValues>;
  hasLogo: string | undefined;
  isSubmitting?: boolean;
  isUploading?: boolean;
  validateStep?: (step: number) => boolean;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ 
  children, 
  form,
  hasLogo,
  isSubmitting,
  isUploading,
  validateStep
}: { 
  children: ReactNode;
  form: UseFormReturn<QuestionnaireFormValues>;
  hasLogo: string | undefined;
  isSubmitting?: boolean;
  isUploading?: boolean;
  validateStep?: (step: number) => boolean;
}) => {
  return (
    <QuestionnaireContext.Provider value={{ 
      form, 
      hasLogo, 
      isSubmitting, 
      isUploading,
      validateStep 
    }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaireContext = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaireContext must be used within a QuestionnaireProvider');
  }
  return context;
};
