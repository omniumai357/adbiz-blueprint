
import { useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useQuestionnaireData } from "@/hooks/data/useQuestionnaireData";
import { supabase } from "@/integrations/supabase/client";
import { FileState } from "./useFileUpload";

export function useQuestionnaireSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { submitQuestionnaireData } = useQuestionnaireData();

  const submitQuestionnaire = async (
    formData: any,
    files: FileState,
    uploadFiles: (businessId: string) => Promise<boolean>
  ) => {
    setSubmitting(true);
    try {
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      // Upload files first
      const filesUploaded = await uploadFiles(userId || "system");
      
      if (!filesUploaded) {
        setSubmitting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload files. Please try again.",
        });
        return false;
      }
      
      // Then submit questionnaire data
      const success = await submitQuestionnaireData(
        formData,
        userId,
        {
          logo: files.logo ? true : false,
          imageCount: files.images.length,
          videoCount: files.videos.length,
          documentCount: files.documents.length,
        }
      );
      
      if (success) {
        toast({
          title: "Submission successful!",
          description: "Your business information has been saved. Our team will review it shortly.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem saving your information. Please try again.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error processing questionnaire:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  
  return {
    submitting,
    submitQuestionnaire
  };
}
