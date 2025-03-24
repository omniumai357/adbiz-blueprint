
import { ContactInfoSection } from "@/components/contact/contact-info-section";
import { ResponseTimeInfo } from "@/components/contact/response-time-info";
import { SocialLinks } from "@/components/contact/social-links";

export const ContactSidebar = () => {
  return (
    <div className="animate-fade-up">
      <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
      
      <ContactInfoSection />
      <ResponseTimeInfo />
      
      <div className="mt-8">
        <SocialLinks />
      </div>
    </div>
  );
};
