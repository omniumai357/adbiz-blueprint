
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const ContactBanner = () => {
  const handleScrollToForm = () => {
    const formElement = document.getElementById("email-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-up">Contact Us</h1>
          <p className="text-muted-foreground mb-6 animate-fade-up [animation-delay:200ms]">
            Have questions or ready to get started? We're here to help.
          </p>
          
          <Button 
            size="lg" 
            className="animate-fade-up [animation-delay:400ms]"
            onClick={handleScrollToForm}
          >
            Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
