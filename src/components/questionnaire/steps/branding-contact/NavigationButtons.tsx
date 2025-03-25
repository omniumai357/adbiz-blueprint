
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onNext: () => void;
  onPrev: () => void;
}

const NavigationButtons: FC<NavigationButtonsProps> = ({ onNext, onPrev }) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
      >
        Back
      </Button>
      <Button
        type="button"
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
};

export default NavigationButtons;
