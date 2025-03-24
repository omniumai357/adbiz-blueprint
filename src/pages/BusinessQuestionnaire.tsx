
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessQuestionnaire from "@/components/BusinessQuestionnaire";

const BusinessQuestionnairePage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect from useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Business Questionnaire</h1>
            <p className="text-muted-foreground">
              Help us understand your business better to create tailored marketing materials that perfectly represent your brand.
            </p>
          </div>
          
          <BusinessQuestionnaire />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessQuestionnairePage;
