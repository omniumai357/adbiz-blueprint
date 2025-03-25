
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface QuestionnaireNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  isSubmitting?: boolean;
  isUploading?: boolean;
  showSubmitButton?: boolean;
}

const QuestionnaireNavigation: FC<QuestionnaireNavigationProps> = ({
  onNext,
  onPrev,
  isSubmitting = false,
  isUploading = false,
  showSubmitButton = false
}) => {
  return (
    <div className="flex justify-between mt-8">
      {onPrev && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          Back
        </Button>
      )}
      
      {showSubmitButton ? (
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? "Processing..." : "Submit Questionnaire"}
        </Button>
      ) : onNext && (
        <Button
          type="button"
          onClick={onNext}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default QuestionnaireNavigation;
