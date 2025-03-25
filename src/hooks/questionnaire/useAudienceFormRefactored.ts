
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import { useCallback } from "react";

/**
 * Hook for managing the audience section of the questionnaire
 * Provides form values and validation for audience information
 */
export function useAudienceFormRefactored() {
  const { form } = useQuestionnaireContext();
  
  // Get form values for audience information
  const targetAudience = form.watch("targetAudience") || "";
  const uniqueSellingPoints = form.watch("uniqueSellingPoints") || "";
  const competitorNotes = form.watch("competitorNotes") || "";
  
  // Check if audience section is complete (optional fields)
  const hasAudienceInfo = useCallback(() => {
    // Since these fields are optional, they always count as "complete"
    // But we can check if any of them have content for UI feedback
    return !!(targetAudience || uniqueSellingPoints || competitorNotes);
  }, [targetAudience, uniqueSellingPoints, competitorNotes]);
  
  // Handle character count for text areas
  const getCharacterCount = useCallback((field: "targetAudience" | "uniqueSellingPoints" | "competitorNotes") => {
    return form.watch(field)?.length || 0;
  }, [form]);
  
  // Provide recommended length guides
  const getFieldRecommendation = useCallback((field: "targetAudience" | "uniqueSellingPoints" | "competitorNotes") => {
    const count = getCharacterCount(field);
    const recommendations = {
      targetAudience: { min: 50, ideal: 150 },
      uniqueSellingPoints: { min: 75, ideal: 200 },
      competitorNotes: { min: 50, ideal: 150 }
    };
    
    const { min, ideal } = recommendations[field];
    
    if (count === 0) return "Optional";
    if (count < min) return `Brief (${min - count} more characters recommended)`;
    if (count < ideal) return "Good";
    return "Excellent";
  }, [getCharacterCount]);
  
  return {
    form,
    targetAudience,
    uniqueSellingPoints,
    competitorNotes,
    hasAudienceInfo,
    getCharacterCount,
    getFieldRecommendation
  };
}
