
import { FC } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

interface QuestionnaireNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  showSubmitButton?: boolean;
  stepNumber?: number;
  isStepComplete?: boolean;
}

const QuestionnaireNavigation: FC<QuestionnaireNavigationProps> = ({
  onNext,
  onPrev,
  showSubmitButton = false,
  stepNumber,
  isStepComplete = true
}) => {
  const { isSubmitting, isUploading, validateStep } = useQuestionnaireContext();
  
  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    
    if (validateStep && stepNumber) {
      validateStep(stepNumber);
    }
  };
  
  return (
    <div className="flex justify-between mt-8">
      {onPrev && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      
      <div className="flex-1" />
      
      {showSubmitButton ? (
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center gap-2"
        >
          {isSubmitting || isUploading ? (
            "Processing..."
          ) : (
            <>
              Submit Questionnaire
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      ) : onNext && (
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepComplete}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuestionnaireNavigation;
