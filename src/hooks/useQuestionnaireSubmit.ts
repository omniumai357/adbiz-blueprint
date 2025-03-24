
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";
import { FileState } from "./useFileUpload";
import { generateUniqueId } from "@/utils/id-generator";

export function useQuestionnaireSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submitQuestionnaire = async (
    formData: any,
    files: FileState,
    uploadFiles: (businessId: string) => Promise<boolean>
  ) => {
    setSubmitting(true);
    try {
      const businessId = generateUniqueId('business');
      
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      const formattedData = {
        ...formData,
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
      };
      
      const filesUploaded = await uploadFiles(userId || businessId);
      
      if (!filesUploaded) {
        setSubmitting(false);
        return false;
      }
      
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
            has_logo: files.logo ? true : false,
            image_count: files.images.length,
            video_count: files.videos.length,
            document_count: files.documents.length,
          },
        });
      
      if (error) {
        console.error("Error saving business data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem saving your information. Please try again.",
        });
        setSubmitting(false);
        return false;
      }
      
      toast({
        title: "Submission successful!",
        description: "Your business information has been saved. Our team will review it shortly.",
      });
      
      setSubmitting(false);
      return true;
    } catch (error) {
      console.error("Error processing questionnaire:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      setSubmitting(false);
      return false;
    }
  };
  
  return {
    submitting,
    submitQuestionnaire
  };
}
