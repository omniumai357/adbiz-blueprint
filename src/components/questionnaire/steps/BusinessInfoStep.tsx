
import { FC } from "react";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

// Import the smaller component sections
import BasicInformation from "./business-info/BasicInformation";
import BusinessDetails from "./business-info/BusinessDetails";
import BusinessDescription from "./business-info/BusinessDescription";
import BusinessLicense from "./business-info/BusinessLicense";
import { Button } from "@/components/ui/button";

interface BusinessInfoStepProps {
  onNext: () => void;
}

const BusinessInfoStep: FC<BusinessInfoStepProps> = ({ onNext }) => {
  // Use the context instead of props
  const { form } = useQuestionnaireContext();
  
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
      
      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
