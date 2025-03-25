
import { FC } from "react";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import SocialMediaSection from "./marketing-goals/SocialMediaSection";
import MarketingGoalsSelection from "./marketing-goals/MarketingGoalsSelection";
import AudienceSection from "./marketing-goals/AudienceSection";
import QuestionnaireNavigation from "../QuestionnaireNavigation";

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
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Marketing Goals & Online Presence
      </h3>
      
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
      />
    </div>
  );
};

export default MarketingGoalsStep;
