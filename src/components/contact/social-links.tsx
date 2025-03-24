
import { companyInfo } from "@/lib/data";

export const SocialLinks = () => {
  return (
    <div>
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
  );
};
