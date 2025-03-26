
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/ui/use-toast';
import { useService } from '@/hooks/services/useService';
import { useUpdateMilestoneProgress } from '@/hooks/queries/useUpdateMilestoneProgress';

/**
 * Hook for managing the Business Questionnaire page state
 * Separates authentication checking and navigation logic from UI
 */
export function useBusinessQuestionnaire() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProgress } = useUpdateMilestoneProgress();
  
  // Handle authentication state and navigation
  useEffect(() => {
    // Redirect if not logged in and auth is not loading
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the business questionnaire",
        variant: "destructive",
      });
      // Save the current page as the redirect URL
      navigate("/auth?redirect=/business-questionnaire");
    }
  }, [user, isLoading, isAuthenticated, navigate, toast]);
  
  const handleQuestionnaireComplete = (data: any) => {
    setIsSubmitting(true);
    
    // Process completion logic here
    console.log('Questionnaire completed with data:', data);
    
    // Award milestone points for completing the questionnaire
    if (user?.id) {
      updateProgress({
        userId: user.id,
        points: 50,
        activityType: 'questionnaire_completed',
        referenceType: 'questionnaire'
      });
    }
    
    // Navigate to success page or perform other actions
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
      toast({
        title: "Questionnaire submitted",
        description: "Thank you for completing the business questionnaire!",
      });
    }, 1000);
  };
  
  return {
    user,
    isLoading: isLoading || isSubmitting,
    isAuthenticated,
    handleQuestionnaireComplete
  };
}
