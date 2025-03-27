
import { Form } from "@/components/ui/form";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import QuestionnaireProgress from "./QuestionnaireProgress";
import BusinessInfoStep from "./steps/BusinessInfoStep";
import BrandingContactStep from "./steps/BrandingContactStep";
import MarketingGoalsStep from "./steps/MarketingGoalsStep";
import FileUploadSection from "./file-upload/FileUploadSection";
import ReviewSection from "./ReviewSection";
import { useQuestionnaireFormRefactored } from "@/hooks/useQuestionnaireFormRefactored";
import { QuestionnaireProvider } from "@/contexts/questionnaire-context";
import { FileUploadProvider } from "@/contexts/file-upload-context";
import QuestionnaireNavigation from "./QuestionnaireNavigation";
import { fileAdapter } from "@/utils/file-adapter";

interface BusinessQuestionnaireFormProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaireFormRefactored = ({ onComplete }: BusinessQuestionnaireFormProps) => {
  const {
    form,
    step,
    files,
    uploading,
    submitting,
    hasLogo,
    handleBusinessInfoNext,
    handleBrandingContactNext,
    handleMarketingGoalsNext,
    handleFileUploadNext,
    prevStep,
    onShowReview,
    onSubmit,
    marketingGoalOptions
  } = useQuestionnaireFormRefactored(onComplete);
  
  // Helper function to validate step by number
  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return handleBusinessInfoNext(true);
      case 2:
        return handleBrandingContactNext(true);
      case 3:
        return handleMarketingGoalsNext(true);
      default:
        return true;
    }
  };
  
  // Adapt files for the ReviewSection component which expects plain File objects
  const adaptedFiles = fileAdapter.adaptFileStateForUI(files);
  
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Business Information Questionnaire
      </h2>
      
      <QuestionnaireProgress currentStep={step} />
      
      {form.submitError && (
        <FormValidationMessage message={form.submitError} />
      )}
      
      <FileUploadProvider>
        <QuestionnaireProvider 
          form={form} 
          hasLogo={hasLogo}
          isSubmitting={submitting}
          isUploading={uploading}
          validateStep={validateStep}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <BusinessInfoStep 
                  onNext={handleBusinessInfoNext}
                />
              )}
              
              {step === 2 && (
                <BrandingContactStep 
                  onNext={handleBrandingContactNext}
                  onPrev={prevStep}
                />
              )}
              
              {step === 3 && (
                <MarketingGoalsStep 
                  onNext={handleMarketingGoalsNext}
                  onPrev={prevStep}
                  marketingGoalOptions={marketingGoalOptions}
                />
              )}
              
              {step === 4 && (
                <>
                  <FileUploadSection
                    hasLogo={hasLogo === "yes"}
                  />
                  
                  <QuestionnaireNavigation
                    onNext={handleFileUploadNext}
                    onPrev={prevStep}
                    stepNumber={4}
                  />
                </>
              )}
              
              {step === 5 && (
                <>
                  <ReviewSection
                    formData={form.getValues()}
                    files={adaptedFiles}
                    onShowReview={onShowReview}
                  />
                  
                  <QuestionnaireNavigation
                    onPrev={prevStep}
                    showSubmitButton={true}
                  />
                </>
              )}
            </form>
          </Form>
        </QuestionnaireProvider>
      </FileUploadProvider>
    </div>
  );
};

export default BusinessQuestionnaireFormRefactored;
