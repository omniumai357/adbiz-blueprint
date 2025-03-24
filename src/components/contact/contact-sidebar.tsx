
import { ContactInfoSection } from "@/components/contact/contact-info-section";
import { ResponseTimeInfo } from "@/components/contact/response-time-info";
import { SocialLinks } from "@/components/contact/social-links";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, CalendarClock } from "lucide-react";

export const ContactSidebar = () => {
  // Get current day and determine business hours status
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  const currentHour = now.getHours();
  
  const isBusinessDay = currentDay >= 1 && currentDay <= 5; // Monday to Friday
  const isBusinessHours = currentHour >= 9 && currentHour < 17; // 9 AM to 5 PM
  const isOpen = isBusinessDay && isBusinessHours;
  
  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
      
      {/* Business Hours Status */}
      <Card className="overflow-hidden">
        <div className={`p-2 text-center text-white ${isOpen ? 'bg-green-500' : 'bg-amber-500'}`}>
          <div className="flex items-center justify-center">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {isOpen ? "We're Open Now" : "Currently Closed"}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start mb-4">
            <CalendarClock className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <h4 className="font-medium">Business Hours</h4>
              <div className="text-sm text-muted-foreground mt-1">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <h4 className="font-medium">Response Time</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {isOpen 
                  ? "We typically respond within 1 hour during business hours." 
                  : "We'll respond to your message when we're back in the office."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ContactInfoSection />
      <ResponseTimeInfo />
      
      <div className="mt-8">
        <SocialLinks />
      </div>
    </div>
  );
};
