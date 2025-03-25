
import { FC } from "react";
import SocialMediaSection from "./marketing-goals/SocialMediaSection";
import MarketingGoalsSelection from "./marketing-goals/MarketingGoalsSelection";
import AudienceSection from "./marketing-goals/AudienceSection";
import QuestionnaireNavigation from "../QuestionnaireNavigation";
import { useMarketingGoalsForm } from "@/hooks/questionnaire/useMarketingGoalsForm";
import MarketingStepHeader from "./marketing-goals/MarketingStepHeader";

interface MarketingGoalsStepProps {
  onNext: () => void;
  onPrev: () => void;
  marketingGoalOptions: Array<{ value: string; label: string }>;
}

const MarketingGoalsStep: FC<MarketingGoalsStepProps> = ({ 
  onNext, 
  onPrev,
  marketingGoalOptions 
}) => {
  const { hasSelectedGoals } = useMarketingGoalsForm();
  
  // Check if this step is complete for navigation
  const isStepComplete = hasSelectedGoals;
  
  return (
    <div className="space-y-6">
      <MarketingStepHeader />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Social Media Section */}
        <SocialMediaSection />
        
        {/* Marketing Goals Section */}
        <MarketingGoalsSelection marketingGoalOptions={marketingGoalOptions} />
        
        {/* Audience & Competitors Section */}
        <AudienceSection />
      </div>
      
      <QuestionnaireNavigation 
        onNext={onNext} 
        onPrev={onPrev}
        stepNumber={3}
        isStepComplete={isStepComplete}
      />
    </div>
  );
};

export default MarketingGoalsStep;
