
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { companyInfo } from "@/lib/data";
import { Twitter, Facebook, Linkedin, Instagram, Mail, Phone, MapPin, HelpCircle } from "lucide-react";
import { TourDiscoveryButton } from "./tour/TourDiscoveryButton";

export const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center text-xl font-bold mb-4">
              <span className="text-primary">ad</span>
              <span>biz</span>
              <span className="text-primary">.pro</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              {companyInfo.description}
            </p>
            <div className="flex space-x-4">
              <a href={companyInfo.socials.twitter} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={companyInfo.socials.facebook} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={companyInfo.socials.linkedin} className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={companyInfo.socials.instagram} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Services", path: "/services" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-medium text-lg mb-4">Our Services</h3>
            <ul className="space-y-3">
              {[
                { label: "Monthly Posting Plans", path: "/services?category=monthly" },
                { label: "Custom SEO-Ad Creation", path: "/services?category=custom" },
                { label: "Platinum Packages", path: "/services?category=platinum" },
              ].map((service) => (
                <li key={service.path}>
                  <Link 
                    to={service.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-medium text-lg mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <a 
                  href={`mailto:${companyInfo.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <a 
                  href={`tel:${companyInfo.phone}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  {companyInfo.address}
                </span>
              </li>
              <li className="flex items-start gap-3 mt-4">
                <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <TourDiscoveryButton variant="text" className="p-0 h-auto text-muted-foreground hover:text-primary transition-colors" />
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {year} {companyInfo.name}. All rights reserved.
          </div>
          
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <TourDiscoveryButton variant="text" className="p-0 h-auto text-muted-foreground hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
