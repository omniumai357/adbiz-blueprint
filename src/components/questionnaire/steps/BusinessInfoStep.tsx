
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import BasicInformation from "./business-info/BasicInformation";
import BusinessLicense from "./business-info/BusinessLicense";
import BusinessDescription from "./business-info/BusinessDescription";
import BusinessDetails from "./business-info/BusinessDetails";
import QuestionnaireNavigation from "../QuestionnaireNavigation";

interface BusinessInfoStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

const BusinessInfoStep: FC<BusinessInfoStepProps> = ({ form, onNext }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Basic Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInformation form={form} />
        <BusinessLicense form={form} />
        <BusinessDescription form={form} />
        <BusinessDetails form={form} />
      </div>
      
      <QuestionnaireNavigation onNext={onNext} />
    </div>
  );
};

export default BusinessInfoStep;
