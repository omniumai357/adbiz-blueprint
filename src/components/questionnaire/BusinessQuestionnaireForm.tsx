
import { z } from "zod";
import { useAppForm } from "@/hooks/forms/useAppForm";
import { Form } from "@/components/ui/form";
import { useQuestionnaireSteps } from "@/hooks/useQuestionnaireSteps";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useQuestionnaireSubmit } from "@/hooks/useQuestionnaireSubmit";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import QuestionnaireProgress from "./QuestionnaireProgress";
import BusinessInfoStep from "./steps/BusinessInfoStep";
import BrandingContactStep from "./steps/BrandingContactStep";
import MarketingGoalsStep from "./steps/MarketingGoalsStep";
import FileUploadSection from "./file-upload/FileUploadSection";
import ReviewSection from "./ReviewSection";
import { Button } from "@/components/ui/button";
import { 
  validateBusinessInfoStep, 
  validateContactInfoStep,
  validateMarketingGoalsStep
} from "@/utils/questionnaire-validation";

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

type FormValues = z.infer<typeof formSchema>;

interface BusinessQuestionnaireFormProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaireForm = ({ onComplete }: BusinessQuestionnaireFormProps) => {
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

  const marketingGoalOptions = [
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
  
  const handleBusinessInfoNext = () => {
    if (validateBusinessInfoStep(form)) {
      nextStep();
    }
  };
  
  const handleBrandingContactNext = () => {
    if (validateContactInfoStep(form)) {
      nextStep();
    }
  };
  
  const handleMarketingGoalsNext = () => {
    if (validateMarketingGoalsStep(form)) {
      nextStep();
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    const success = await submitQuestionnaire(data, files, uploadFiles);
    
    if (success && onComplete) {
      onComplete({
        businessId: generateUniqueId('business'),
        data,
        files,
      });
    }
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
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Continue to Review
                </Button>
              </div>
            </>
          )}
          
          {step === 5 && (
            <>
              <ReviewSection
                formData={form.getValues()}
                files={files}
                onShowReview={onShowReview}
              />
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || uploading}
                >
                  {submitting || uploading ? "Processing..." : "Submit Questionnaire"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BusinessQuestionnaireForm;
