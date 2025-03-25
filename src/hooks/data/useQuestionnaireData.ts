
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuestionnaireFormValues } from '@/hooks/useQuestionnaireForm';
import { generateUniqueId } from '@/utils/id-generator';

/**
 * Hook for fetching and submitting business questionnaire data
 * 
 * @returns Object containing submission functions and loading states
 */
export function useQuestionnaireData() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  /**
   * Submit business questionnaire data to the database
   * 
   * @param formData The form data to submit
   * @param userId The user ID, if available
   * @returns Promise resolving to success status
   */
  const submitQuestionnaireData = async (
    formData: QuestionnaireFormValues,
    userId: string | null | undefined,
    uploadedFiles: { 
      logo: boolean; 
      imageCount: number; 
      videoCount: number; 
      documentCount: number;
    }
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const businessId = generateUniqueId('business');
      
      const { error } = await supabase
        .from("business_questionnaires")
        .insert({
          user_id: userId || "system",
          business_name: formData.businessName,
          industry: formData.industry,
          other_industry: formData.otherIndustry,
          business_description: formData.businessDescription,
          business_size: formData.businessSize,
          years_in_business: formData.yearsInBusiness,
          service_area: formData.serviceArea,
          business_license_number: formData.businessLicenseNumber,
          slogan: formData.slogan,
          mission_statement: formData.missionStatement,
          has_business_license: formData.hasBusinessLicense === "yes",
          has_logo: formData.hasLogo === "yes",
          need_logo_design: formData.needLogoDesign === "yes",
          brand_colors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
            accent: formData.accentColor,
          },
          contact_info: {
            phone: formData.phoneNumber,
            email: formData.email,
            website: formData.website,
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zipCode,
            },
          },
          social_media: formData.hasSocialMedia === "yes" ? {
            platforms: formData.platformsUsed,
            facebook: formData.facebookUrl,
            instagram: formData.instagramHandle,
            twitter: formData.twitterHandle,
            linkedin: formData.linkedinUrl,
            other: formData.otherSocialMedia,
          } : null,
          marketing_goals: formData.marketingGoals,
          target_audience: formData.targetAudience,
          unique_selling_points: formData.uniqueSellingPoints,
          uploaded_files: {
            has_logo: uploadedFiles.logo,
            image_count: uploadedFiles.imageCount,
            video_count: uploadedFiles.videoCount,
            document_count: uploadedFiles.documentCount,
          },
        });
      
      if (error) {
        console.error("Error saving business data:", error);
        setSubmitError("There was a problem saving your information. Please try again.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error processing questionnaire:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuestionnaireData,
    isSubmitting,
    submitError,
  };
}
