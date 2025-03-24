
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { companyInfo } from "@/lib/data";

export const ContactInfoSection = () => {
  return (
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
  );
};
