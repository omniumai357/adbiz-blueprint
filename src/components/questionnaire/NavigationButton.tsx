
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

interface NavigationButtonProps {
  direction: "next" | "prev" | "submit";
  stepNumber?: number;
  onAction?: () => void;
  className?: string;
}

const NavigationButton: FC<NavigationButtonProps> = ({ 
  direction, 
  stepNumber, 
  onAction,
  className
}) => {
  const { isSubmitting, isUploading, validateStep } = useQuestionnaireContext();
  
  const handleClick = () => {
    if (onAction) {
      onAction();
      return;
    }
    
    if (direction === "next" && validateStep && stepNumber) {
      validateStep(stepNumber);
    }
  };
  
  const isDisabled = (direction === "submit" && (isSubmitting || isUploading));
  
  return (
    <Button
      type={direction === "submit" ? "submit" : "button"}
      variant={direction === "prev" ? "outline" : "default"}
      onClick={handleClick}
      disabled={isDisabled}
      className={className}
    >
      {direction === "next" && "Continue"}
      {direction === "prev" && "Back"}
      {direction === "submit" && (isSubmitting || isUploading ? "Processing..." : "Submit Questionnaire")}
    </Button>
  );
};

export default NavigationButton;
