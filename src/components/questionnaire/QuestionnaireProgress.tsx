
import { FC } from "react";

interface QuestionnaireProgressProps {
  currentStep: number;
}

const QuestionnaireProgress: FC<QuestionnaireProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Business Info" },
    { number: 2, label: "Branding" },
    { number: 3, label: "Marketing" },
    { number: 4, label: "Assets" },
    { number: 5, label: "Review" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white 
                ${currentStep === step.number 
                  ? 'bg-primary' 
                  : currentStep > step.number 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'}`}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div className="text-xs mt-2 text-gray-600">
              {step.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="relative mt-2">
        <div className="absolute h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute h-1 bg-primary transition-all" 
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuestionnaireProgress;
