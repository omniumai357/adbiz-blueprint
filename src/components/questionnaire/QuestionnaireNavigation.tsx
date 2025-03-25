
import { FC } from "react";
import NavigationButton from "./NavigationButton";

interface QuestionnaireNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  isSubmitting?: boolean;
  isUploading?: boolean;
  showSubmitButton?: boolean;
  stepNumber?: number;
}

const QuestionnaireNavigation: FC<QuestionnaireNavigationProps> = ({
  onNext,
  onPrev,
  showSubmitButton = false,
  stepNumber
}) => {
  return (
    <div className="flex justify-between mt-8">
      {onPrev && (
        <NavigationButton
          direction="prev"
          onAction={onPrev}
        />
      )}
      
      {showSubmitButton ? (
        <NavigationButton
          direction="submit"
        />
      ) : onNext && (
        <NavigationButton
          direction="next"
          onAction={onNext}
          stepNumber={stepNumber}
        />
      )}
    </div>
  );
};

export default QuestionnaireNavigation;
