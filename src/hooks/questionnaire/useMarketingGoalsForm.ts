
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

export function useMarketingGoalsForm() {
  const { form } = useQuestionnaireContext();
  
  // Get form values
  const hasSocialMedia = form.watch("hasSocialMedia");
  const platformsUsed = form.watch("platformsUsed") || [];
  
  // Determine which social media fields to show based on selected platforms
  const showFacebookField = platformsUsed.includes("facebook");
  const showInstagramField = platformsUsed.includes("instagram");
  const showTwitterField = platformsUsed.includes("twitter");
  const showLinkedinField = platformsUsed.includes("linkedin");
  const showOtherField = platformsUsed.includes("other");
  
  return {
    form,
    hasSocialMedia,
    platformsUsed,
    showFacebookField,
    showInstagramField,
    showTwitterField,
    showLinkedinField,
    showOtherField
  };
}
