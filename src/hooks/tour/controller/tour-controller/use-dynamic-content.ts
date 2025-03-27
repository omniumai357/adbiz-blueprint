
import { useState, useCallback } from 'react';
import { TourStep } from '@/contexts/tour/types';

export const useDynamicContent = (initialSteps: TourStep[] = []) => {
  const [visibleSteps, setVisibleSteps] = useState<TourStep[]>(initialSteps);

  const setDynamicContent = useCallback((stepId: string, content: string) => {
    setVisibleSteps(prevSteps => {
      const newSteps = [...prevSteps];
      const stepIndex = newSteps.findIndex(step => step.id === stepId);
      
      if (stepIndex >= 0) {
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          content
        };
      }
      
      return newSteps;
    });
  }, []);

  const getContentForStep = useCallback((step: TourStep): string => {
    if (!step) return '';
    return step.content || '';
  }, []);

  return {
    visibleSteps,
    setVisibleSteps,
    setDynamicContent,
    getContentForStep
  };
};
