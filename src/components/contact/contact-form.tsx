
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/ui/use-toast";
import { MessageSquare } from "lucide-react";
import { ContactFormFields } from "@/components/contact/contact-form-fields";
import { ContactSuccessMessage } from "@/components/contact/contact-success-message";
import { ContactFormData } from "@/types/contact";

// Contact form initial state
const initialFormState: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export const ContactForm = () => {
  const [formState, setFormState] = useState<ContactFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };
  
  const handleReset = () => {
    setFormState(initialFormState);
    setIsSubmitted(false);
  };

  return (
    <div className="animate-fade-up [animation-delay:300ms]" id="email-form">
      {isSubmitted ? (
        <ContactSuccessMessage onReset={handleReset} />
      ) : (
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Send a Message</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <ContactFormFields 
              formState={formState}
              handleChange={handleChange}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our 
              <a href="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</a>
              and
              <a href="/terms" className="text-primary hover:underline ml-1">Terms of Service</a>.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};
