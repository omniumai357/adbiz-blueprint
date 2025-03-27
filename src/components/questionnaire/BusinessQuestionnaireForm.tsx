
import { Form } from "@/components/ui/form";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import QuestionnaireProgress from "./QuestionnaireProgress";
import BusinessInfoStep from "./steps/BusinessInfoStep";
import BrandingContactStep from "./steps/BrandingContactStep";
import MarketingGoalsStep from "./steps/MarketingGoalsStep";
import FileUploadSection from "./file-upload/FileUploadSection";
import ReviewSection from "./ReviewSection";
import { useQuestionnaireForm } from "@/hooks/useQuestionnaireForm";
import { QuestionnaireProvider } from "@/contexts/questionnaire-context";
import { FileUploadProvider } from "@/contexts/file-upload-context";
import QuestionnaireNavigation from "./QuestionnaireNavigation";
import { fileAdapter } from "@/utils/file-adapter";
import { FileState, FileItem } from "@/features/file-upload/types";
import { logger } from '@/utils/logger';

interface BusinessQuestionnaireFormProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaireForm = ({ onComplete }: BusinessQuestionnaireFormProps) => {
  const {
    form,
    step,
    files,
    uploadError,
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
  } = useQuestionnaireForm(onComplete);
  
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
  
  // Helper function to extract File objects from FileItems
  const extractFilesFromFileItems = (items: FileItem[]): File[] => {
    return items.map(item => item.file);
  };
  
  // Create a properly structured FileState object for adaptation
  const fileState: FileState = {
    identity: [],
    business: [],
    additional: [],
    logo: files.logo,
    // Handle images properly, ensuring they are FileItems
    images: Array.isArray(files.images) 
      ? (files.images as any[]).every(item => item && 'file' in item) 
        ? files.images as FileItem[]
        : fileAdapter.createFileItems(files.images as File[])
      : [],
    // Handle videos properly, ensuring they are FileItems
    videos: Array.isArray(files.videos) 
      ? (files.videos as any[]).every(item => item && 'file' in item) 
        ? files.videos as FileItem[]
        : fileAdapter.createFileItems(files.videos as File[])
      : [],
    // Handle documents properly, ensuring they are FileItems
    documents: Array.isArray(files.documents) 
      ? (files.documents as any[]).every(item => item && 'file' in item) 
        ? files.documents as FileItem[]
        : fileAdapter.createFileItems(files.documents as File[])
      : []
  };
  
  // Log file state transformations at debug level
  logger.debug('File state being adapted for UI', { 
    hasLogo: !!fileState.logo,
    imagesCount: fileState.images.length,
    videosCount: fileState.videos.length,
    documentsCount: fileState.documents.length
  });
  
  // Adapt files for the ReviewSection component which expects plain File objects
  const adaptedFiles = fileAdapter.adaptFileStateForUI(fileState);
  
  // Extract File objects for ReviewSection (fixes type issues)
  const reviewFiles = {
    logo: adaptedFiles.logo as File | null,
    // Explicitly cast arrays and extract File objects to resolve type issues
    images: extractFilesFromFileItems(fileState.images as FileItem[]),
    videos: extractFilesFromFileItems(fileState.videos as FileItem[]),
    documents: extractFilesFromFileItems(fileState.documents as FileItem[])
  };
  
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
                    files={reviewFiles}
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

export default BusinessQuestionnaireForm;
