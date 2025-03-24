
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactBanner } from "@/components/contact/contact-banner";
import { ContactSidebar } from "@/components/contact/contact-sidebar";
import { ContactForm } from "@/components/contact/contact-form";
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

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Contact Banner */}
        <ContactBanner />
        
        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <ContactSidebar />
              
              {/* Contact Form */}
              <ContactForm />
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
