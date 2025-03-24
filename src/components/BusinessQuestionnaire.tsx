
import { FC } from "react";
import BusinessQuestionnaireForm from "./questionnaire/BusinessQuestionnaireForm";

interface BusinessQuestionnaireProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaire: FC<BusinessQuestionnaireProps> = ({ onComplete }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <BusinessQuestionnaireForm />
    </div>
  );
};

export default BusinessQuestionnaire;
