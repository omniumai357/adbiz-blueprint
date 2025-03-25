
import React, { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormValues } from '@/hooks/useQuestionnaireForm';

interface QuestionnaireContextType {
  form: UseFormReturn<QuestionnaireFormValues>;
  hasLogo: string | undefined;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ 
  children, 
  form,
  hasLogo
}: { 
  children: ReactNode;
  form: UseFormReturn<QuestionnaireFormValues>;
  hasLogo: string | undefined;
}) => {
  return (
    <QuestionnaireContext.Provider value={{ form, hasLogo }}>
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
