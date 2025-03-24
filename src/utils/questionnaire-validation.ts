
import { UseFormReturn } from "react-hook-form";

export const validateBusinessInfoStep = (form: UseFormReturn<any>) => {
  const { businessName, industry, businessDescription, serviceArea } = form.getValues();
  if (!businessName || !industry || !businessDescription || !serviceArea) {
    form.trigger(["businessName", "industry", "businessDescription", "serviceArea"]);
    return false;
  }
  return true;
};

export const validateContactInfoStep = (form: UseFormReturn<any>) => {
  const { phoneNumber, email } = form.getValues();
  if (!phoneNumber || !email) {
    form.trigger(["phoneNumber", "email"]);
    return false;
  }
  return true;
};

export const validateMarketingGoalsStep = (form: UseFormReturn<any>) => {
  const { marketingGoals } = form.getValues();
  if (!marketingGoals || marketingGoals.length === 0) {
    form.trigger(["marketingGoals"]);
    return false;
  }
  return true;
};
