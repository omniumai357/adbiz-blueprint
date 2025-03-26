
import { useState, useEffect } from "react";
import { TourStep } from "@/contexts/tour/types";
import { DynamicContentProvider } from "@/hooks/tour/analytics/types";
import { processDynamicContent } from "@/hooks/tour/controller/step-processor";

/**
 * Hook to handle dynamic content processing for tour steps
 * 
 * @param currentStepData Current tour step data
 * @param setDynamicContent Function to update dynamic content
 * @returns Object containing loading state and processed content
 */
export function useTourDynamicContent(
  currentStepData: TourStep | null,
  setDynamicContent: (stepId: string, content: string) => void
) {
  const [isProcessingDynamicContent, setIsProcessingDynamicContent] = useState(false);
  
  // Process dynamic content when step changes
  useEffect(() => {
    const processDynamicStepContent = async () => {
      if (!currentStepData || !currentStepData.metadata?.dynamicContentProvider) return;
      
      setIsProcessingDynamicContent(true);
      try {
        // Create a temporary helper to process the step content
        const dynamicContentProvider = currentStepData.metadata.dynamicContentProvider as DynamicContentProvider;
        let processedContent: string;
        
        try {
          const content = await Promise.resolve(dynamicContentProvider());
          processedContent = content || currentStepData.content;
        } catch (error) {
          console.error("Error processing dynamic content:", error);
          processedContent = currentStepData.content;
        }
        
        if (processedContent !== currentStepData.content) {
          setDynamicContent(currentStepData.id, processedContent);
        }
      } catch (error) {
        console.error("Error in dynamic content processing:", error);
      } finally {
        setIsProcessingDynamicContent(false);
      }
    };
    
    processDynamicStepContent();
  }, [currentStepData, setDynamicContent]);

  const content = isProcessingDynamicContent 
    ? "Loading personalized content..." 
    : (currentStepData?.content || "");

  return {
    isProcessingDynamicContent,
    content
  };
}
