
import React from "react";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import {
  FormTextField,
  FormTextAreaField,
  FormCheckboxField
} from "@/components/questionnaire/form-fields";

import QuestionnaireNavigation from "@/components/questionnaire/QuestionnaireNavigation";

interface AudienceStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const AudienceStep: React.FC<AudienceStepProps> = ({ onNext, onPrev }) => {
  const { form } = useQuestionnaireContext();
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Target Audience Information</h3>
        <p className="text-muted-foreground">
          Help us understand who your ideal customers are and what makes your business unique.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormTextAreaField
          name="targetAudience"
          label="Describe your target audience"
          description="Who are your ideal customers? Include demographics, interests, and behaviors."
          showCharCount
          maxLength={500}
          className="md:col-span-2"
        />
        
        <FormTextAreaField
          name="uniqueSellingPoints"
          label="What makes your business unique?"
          description="Describe your unique selling points and competitive advantages."
          showCharCount
          maxLength={500}
          className="md:col-span-2"
        />
        
        <FormTextAreaField
          name="competitorNotes"
          label="Information about competitors"
          description="List your main competitors and how you differentiate from them."
          showCharCount
          maxLength={500}
          className="md:col-span-2"
        />
      </div>
      
      <div className="mt-8">
        <QuestionnaireNavigation
          onNext={onNext}
          onPrev={onPrev}
          stepNumber={3}
        />
      </div>
    </div>
  );
};

export default AudienceStep;
