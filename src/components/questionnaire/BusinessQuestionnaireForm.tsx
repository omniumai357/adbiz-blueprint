
import { Form } from "@/components/ui/form";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import QuestionnaireProgress from "./QuestionnaireProgress";
import BusinessInfoStep from "./steps/BusinessInfoStep";
import BrandingContactStep from "./steps/BrandingContactStep";
import MarketingGoalsStep from "./steps/MarketingGoalsStep";
import FileUploadSection from "./file-upload/FileUploadSection";
import ReviewSection from "./ReviewSection";
import QuestionnaireNavigation from "./QuestionnaireNavigation";
import { useQuestionnaireForm } from "@/hooks/useQuestionnaireForm";

interface BusinessQuestionnaireFormProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaireForm = ({ onComplete }: BusinessQuestionnaireFormProps) => {
  const {
    form,
    step,
    files,
    uploadProgress,
    uploadError,
    uploading,
    submitting,
    hasLogo,
    handleFileChange,
    onRemoveFile,
    handleBusinessInfoNext,
    handleBrandingContactNext,
    handleMarketingGoalsNext,
    handleFileUploadNext,
    prevStep,
    onShowReview,
    onSubmit,
    marketingGoalOptions
  } = useQuestionnaireForm(onComplete);
  
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Business Information Questionnaire
      </h2>
      
      <QuestionnaireProgress currentStep={step} />
      
      {form.submitError && (
        <FormValidationMessage message={form.submitError} />
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <BusinessInfoStep 
              form={form} 
              onNext={handleBusinessInfoNext} 
            />
          )}
          
          {step === 2 && (
            <BrandingContactStep 
              form={form} 
              onNext={handleBrandingContactNext}
              onPrev={prevStep}
            />
          )}
          
          {step === 3 && (
            <MarketingGoalsStep 
              form={form} 
              onNext={handleMarketingGoalsNext}
              onPrev={prevStep}
              marketingGoalOptions={marketingGoalOptions}
            />
          )}
          
          {step === 4 && (
            <>
              <FileUploadSection
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={onRemoveFile}
                uploadProgress={uploadProgress}
                uploadError={uploadError}
                hasLogo={hasLogo === "yes"}
              />
              
              <QuestionnaireNavigation
                onNext={handleFileUploadNext}
                onPrev={prevStep}
              />
            </>
          )}
          
          {step === 5 && (
            <>
              <ReviewSection
                formData={form.getValues()}
                files={files}
                onShowReview={onShowReview}
              />
              
              <QuestionnaireNavigation
                onPrev={prevStep}
                isSubmitting={submitting}
                isUploading={uploading}
                showSubmitButton={true}
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BusinessQuestionnaireForm;
