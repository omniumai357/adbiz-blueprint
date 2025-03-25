
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import { useCallback } from "react";

export function useAudienceForm() {
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
  
  return {
    form,
    targetAudience,
    uniqueSellingPoints,
    competitorNotes,
    hasAudienceInfo,
    getCharacterCount
  };
}
