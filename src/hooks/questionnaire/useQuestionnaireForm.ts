
import { useAppForm } from "@/hooks/forms/useAppForm";
import { useQuestionnaireSubmit } from "@/hooks/useQuestionnaireSubmit";
import { QuestionnaireFormValues, formSchema, marketingGoalOptions } from "./useQuestionnaireSchema";
import { useQuestionnaireStep } from "./useQuestionnaireStep";
import { useQuestionnaireFileUpload } from "./useQuestionnaireFileUpload";
import { fileAdapter } from "@/utils/file-adapter";
import { logger } from '@/utils/logger';

export function useQuestionnaireForm(onComplete?: (data: any) => void) {
  logger.debug('Initializing questionnaire form');
  
  // Initialize the form with Zod schema
  const form = useAppForm(formSchema, {
    defaultValues: {
      marketingGoals: [],
      platformsUsed: [],
    },
  });
  
  // Get the hasLogo value from the form
  const hasLogo = form.watch("hasLogo");
  
  // Import step handling functionality
  const stepHandler = useQuestionnaireStep(form);
  
  // Import file upload functionality
  const fileUploader = useQuestionnaireFileUpload();
  
  // Import submission functionality
  const { submitting, submitQuestionnaire } = useQuestionnaireSubmit();
  
  // Handle form submission
  const onSubmit = async (data: QuestionnaireFormValues) => {
    const businessId = fileUploader.generateBusinessId();
    
    // Upload files
    const filesUploaded = await fileUploader.uploadFiles(businessId);
    if (!filesUploaded) return false;
    
    // Prepare files for submission
    const compatibleFiles = fileUploader.prepareFilesForSubmission();
    
    // Submit questionnaire data
    const uploadFilesPromise = () => Promise.resolve(filesUploaded);
    const success = await submitQuestionnaire(data, compatibleFiles, uploadFilesPromise);
    
    // Call the onComplete callback if provided
    if (success && onComplete) {
      const adaptedFiles = fileAdapter.adaptFileStateForUI(compatibleFiles);
      onComplete({
        businessId,
        data,
        files: adaptedFiles,
      });
    }
    
    return success;
  };

  return {
    form,
    step: stepHandler.step,
    showReview: stepHandler.showReview,
    nextStep: stepHandler.nextStep,
    prevStep: stepHandler.prevStep,
    onShowReview: stepHandler.onShowReview,
    files: fileUploader.files,
    uploading: fileUploader.uploading,
    submitting,
    hasLogo,
    handleBusinessInfoNext: stepHandler.handleBusinessInfoNext,
    handleBrandingContactNext: stepHandler.handleBrandingContactNext,
    handleMarketingGoalsNext: stepHandler.handleMarketingGoalsNext,
    handleFileUploadNext: stepHandler.handleFileUploadNext,
    onSubmit,
    marketingGoalOptions
  };
}
