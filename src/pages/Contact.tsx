
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/ui/use-toast";
import { MessageSquare } from "lucide-react";
import { ContactFormFields } from "@/components/contact/contact-form-fields";
import { ContactInfoSection } from "@/components/contact/contact-info-section";
import { ResponseTimeInfo } from "@/components/contact/response-time-info";
import { SocialLinks } from "@/components/contact/social-links";
import { ContactSuccessMessage } from "@/components/contact/contact-success-message";
import { ContactFAQ } from "@/components/contact/contact-faq";

// FAQ data
const faqs = [
  {
    question: "How quickly can you start working on my ads?",
    answer: "We begin working on your campaign within 24 hours of your purchase. You'll receive the first deliverables based on your selected package timeline.",
  },
  {
    question: "Do you offer customized services?",
    answer: "Yes, we can create custom advertising solutions tailored to your specific business needs. Contact us to discuss your requirements.",
  },
  {
    question: "Can I upgrade my package later?",
    answer: "Absolutely! You can upgrade to a higher tier package at any time. We'll prorate the difference based on your remaining subscription period.",
  },
  {
    question: "What information do you need from me?",
    answer: "After purchase, you'll receive a brief questionnaire about your business, target audience, and goals to help us create effective ads for your campaign.",
  },
];

// Contact form initial state
const initialFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const Contact = () => {
  const [formState, setFormState] = useState(initialFormState);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Contact Banner */}
        <section className="py-16 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4 animate-fade-up">Contact Us</h1>
              <p className="text-muted-foreground animate-fade-up [animation-delay:200ms]">
                Have questions or ready to get started? We're here to help.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                
                <ContactInfoSection />
                <ResponseTimeInfo />
                
                <div className="mt-8">
                  <SocialLinks />
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="animate-fade-up [animation-delay:300ms]">
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
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <ContactFAQ faqs={faqs} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
