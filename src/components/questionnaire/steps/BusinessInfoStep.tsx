
import { FC } from "react";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

// Import the smaller component sections
import BasicInformation from "./business-info/BasicInformation";
import BusinessDetails from "./business-info/BusinessDetails";
import BusinessDescription from "./business-info/BusinessDescription";
import BusinessLicense from "./business-info/BusinessLicense";
import QuestionnaireNavigation from "../QuestionnaireNavigation";

interface BusinessInfoStepProps {
  onNext?: () => void;
}

const BusinessInfoStep: FC<BusinessInfoStepProps> = ({ onNext }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <BasicInformation />
        
        {/* Business Details */}
        <BusinessDetails />
        
        {/* Business Description */}
        <BusinessDescription />
        
        {/* Business License */}
        <BusinessLicense />
      </div>
      
      <QuestionnaireNavigation 
        onNext={onNext}
        stepNumber={1}
      />
    </div>
  );
};

export default BusinessInfoStep;
