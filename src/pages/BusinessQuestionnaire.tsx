
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessQuestionnaire from "@/components/BusinessQuestionnaire";
import { useBusinessQuestionnaire } from "@/hooks/useBusinessQuestionnaire";

const BusinessQuestionnairePage = () => {
  const { isLoading, isAuthenticated, handleQuestionnaireComplete } = useBusinessQuestionnaire();
  
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
          
          <BusinessQuestionnaire onComplete={handleQuestionnaireComplete} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessQuestionnairePage;
