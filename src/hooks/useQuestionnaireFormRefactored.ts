import { z } from "zod";
import { useAppForm } from "@/hooks/forms/useAppForm";
import { useQuestionnaireSteps } from "@/hooks/useQuestionnaireSteps";
import { useQuestionnaireSubmit } from "@/hooks/useQuestionnaireSubmit";
import { generateUniqueId } from "@/utils/id-generator";
import { 
  validateBusinessInfoStep, 
  validateContactInfoStep,
  validateMarketingGoalsStep
} from "@/utils/questionnaire-validation";
import { useFileUploadContext } from "@/contexts/file-upload-context";
import { useFileUploadService } from "@/hooks/file-upload/useFileUploadService";
import { fileAdapter } from "@/utils/file-adapter";
import { FileItem, FileState } from "@/features/file-upload/types";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  otherIndustry: z.string().optional(),
  hasBusinessLicense: z.enum(["yes", "no"]).optional(),
  businessLicenseNumber: z.string().optional(),
  businessDescription: z.string().min(50, "Please provide at least 50 characters"),
  yearsInBusiness: z.string().optional(),
  businessSize: z.string().optional(),
  serviceArea: z.string().min(1, "Service area is required"),
  
  slogan: z.string().optional(),
  missionStatement: z.string().optional(),
  hasLogo: z.enum(["yes", "no"]).optional(),
  needLogoDesign: z.enum(["yes", "no"]).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  hasSocialMedia: z.enum(["yes", "no"]).optional(),
  platformsUsed: z.array(z.string()).optional(),
  facebookUrl: z.string().optional(),
  instagramHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  linkedinUrl: z.string().optional(),
  otherSocialMedia: z.string().optional(),
  
  marketingGoals: z.array(z.string()).min(1, "Please select at least one goal"),
  targetAudience: z.string().optional(),
  uniqueSellingPoints: z.string().optional(),
  competitorNotes: z.string().optional(),
});

export type QuestionnaireFormValues = z.infer<typeof formSchema>;

export const marketingGoalOptions = [
  { value: "moreLeads", label: "Generate more leads" },
  { value: "brandAwareness", label: "Increase brand awareness" },
  { value: "higherBookings", label: "Get more bookings/appointments" },
  { value: "expandService", label: "Expand service area" },
  { value: "increaseRevenue", label: "Increase revenue" },
  { value: "attractEmployees", label: "Attract employees/contractors" },
  { value: "newWebsite", label: "Create/improve website" },
  { value: "onlineReputation", label: "Improve online reputation" },
  { value: "socialMedia", label: "Grow social media presence" },
  { value: "rebrand", label: "Rebrand business" },
];

export function useQuestionnaireFormRefactored(onComplete?: (data: any) => void) {
  const { step, showReview, nextStep, prevStep, onShowReview } = useQuestionnaireSteps(1);
  
  const { files, uploading } = useFileUploadContext();
  const { uploadFile, isUploading } = useFileUploadService();
  
  const { submitting, submitQuestionnaire } = useQuestionnaireSubmit();
  
  const form = useAppForm(formSchema, {
    defaultValues: {
      marketingGoals: [],
      platformsUsed: [],
    },
  });
  
  const hasLogo = form.watch("hasLogo");

  const handleBusinessInfoNext = (validateOnly = false) => {
    if (validateBusinessInfoStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleBrandingContactNext = (validateOnly = false) => {
    if (validateContactInfoStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleMarketingGoalsNext = (validateOnly = false) => {
    if (validateMarketingGoalsStep(form)) {
      if (!validateOnly) nextStep();
      return true;
    }
    return false;
  };
  
  const handleFileUploadNext = () => {
    nextStep();
  };
  
  const onSubmit = async (data: QuestionnaireFormValues) => {
    const businessId = generateUniqueId('business');
    
    let filesUploaded = true;
    
    try {
      if (files.logo) {
        const logoUrl = await uploadFile(files.logo, `${businessId}/logo`);
        if (!logoUrl) filesUploaded = false;
      }
      
      if (Array.isArray(files.images)) {
        for (const fileItem of files.images as FileItem[]) {
          const imageUrl = await uploadFile(fileItem.file, `${businessId}/images`);
          if (!imageUrl) filesUploaded = false;
        }
      }
      
      if (Array.isArray(files.videos)) {
        for (const fileItem of files.videos as FileItem[]) {
          const videoUrl = await uploadFile(fileItem.file, `${businessId}/videos`);
          if (!videoUrl) filesUploaded = false;
        }
      }
      
      if (Array.isArray(files.documents)) {
        for (const fileItem of files.documents as FileItem[]) {
          const docUrl = await uploadFile(fileItem.file, `${businessId}/documents`);
          if (!docUrl) filesUploaded = false;
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      filesUploaded = false;
    }
    
    if (!filesUploaded) {
      return false;
    }
    
    const fileState: FileState = {
      identity: [],
      business: [],
      additional: [],
      logo: files.logo,
      images: files.images as FileItem[],
      videos: files.videos as FileItem[],
      documents: files.documents as FileItem[]
    };
    
    const adaptedFiles = fileAdapter.adaptFileStateForUI(fileState);
    
    const compatibleFiles = fileAdapter.adaptUIFilesToFileState(adaptedFiles);
    
    const uploadFilesPromise = () => Promise.resolve(filesUploaded);
    const success = await submitQuestionnaire(data, compatibleFiles, uploadFilesPromise);
    
    if (success && onComplete) {
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
    step,
    showReview,
    nextStep,
    prevStep,
    onShowReview,
    files,
    uploading,
    submitting,
    hasLogo,
    handleBusinessInfoNext,
    handleBrandingContactNext,
    handleMarketingGoalsNext,
    handleFileUploadNext,
    onSubmit,
    marketingGoalOptions
  };
}
