
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { companyInfo } from "@/lib/data";
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  
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
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email Us</h3>
                      <a 
                        href={`mailto:${companyInfo.email}`}
                        className="text-primary hover:underline"
                      >
                        {companyInfo.email}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        For general inquiries and support
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Call Us</h3>
                      <a 
                        href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-primary hover:underline"
                      >
                        {companyInfo.phone}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mon-Fri, 9:00 AM - 6:00 PM EST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Our Location</h3>
                      <p className="text-foreground">
                        {companyInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    Response Time
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href={companyInfo.socials.twitter} 
                      className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="Twitter"
                    >
                      <span className="text-primary font-bold">T</span>
                    </a>
                    <a 
                      href={companyInfo.socials.facebook} 
                      className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="Facebook"
                    >
                      <span className="text-primary font-bold">F</span>
                    </a>
                    <a 
                      href={companyInfo.socials.linkedin} 
                      className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <span className="text-primary font-bold">L</span>
                    </a>
                    <a 
                      href={companyInfo.socials.instagram} 
                      className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="Instagram"
                    >
                      <span className="text-primary font-bold">I</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="animate-fade-up [animation-delay:300ms]">
                {isSubmitted ? (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your message has been received. We'll get back to you as soon as possible.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Send a Message</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formState.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formState.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(123) 456-7890"
                            value={formState.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            name="company"
                            placeholder="Your Company, Inc."
                            value={formState.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="How can we help you?"
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
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
        <section className="py-16 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about our services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
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
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-lg p-6 animate-fade-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
