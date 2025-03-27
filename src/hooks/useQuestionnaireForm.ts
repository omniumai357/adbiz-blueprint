import { useQuestionnaireSteps } from "@/hooks/useQuestionnaireSteps";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useQuestionnaireSubmit } from "@/hooks/useQuestionnaireSubmit";
import { z } from "zod";
import { useAppForm } from "@/hooks/forms/useAppForm";
import { generateUniqueId } from "@/utils/id-generator";
import { 
  validateBusinessInfoStep, 
  validateContactInfoStep,
  validateMarketingGoalsStep
} from "@/utils/questionnaire-validation";
import { FileState, FileItem } from "@/features/file-upload/types";
import { fileAdapter } from "@/utils/file-adapter";

// Define the form schema for validation
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

export function useQuestionnaireForm(onComplete?: (data: any) => void) {
  const { step, showReview, nextStep, prevStep, onShowReview } = useQuestionnaireSteps(1);
  
  const {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    setUploadError
  } = useFileUpload();
  
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
    // Create a properly structured FileState object
    const fileState: FileState = {
      identity: [],
      business: [],
      additional: [],
      logo: files.logo,
      images: files.images as FileItem[],
      videos: files.videos as FileItem[],
      documents: files.documents as FileItem[]
    };
    
    // Get UI-friendly files
    const adaptedFiles = fileAdapter.adaptFileStateForUI(fileState);
    
    // Convert back to the full FileState format with identity, business, additional arrays
    const compatibleFiles = fileAdapter.adaptUIFilesToFileState(adaptedFiles);
    
    const success = await submitQuestionnaire(data, compatibleFiles, uploadFiles);
    
    if (success && onComplete) {
      onComplete({
        businessId: generateUniqueId('business'),
        data,
        files: adaptedFiles,
      });
    }
  };

  return {
    form,
    step,
    showReview,
    nextStep,
    prevStep,
    onShowReview,
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
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
