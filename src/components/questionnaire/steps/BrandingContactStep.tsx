
import { FC } from "react";

// Import the smaller components
import BrandingSection from "./branding-contact/BrandingSection";
import LogoSection from "./branding-contact/LogoSection";
import ColorSelection from "./branding-contact/ColorSelection";
import ContactSection from "./branding-contact/ContactSection";
import AddressSection from "./branding-contact/AddressSection";
import NavigationButtons from "./branding-contact/NavigationButtons";

interface BrandingContactStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const BrandingContactStep: FC<BrandingContactStepProps> = ({ onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Branding & Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branding Section */}
        <BrandingSection />
        
        {/* Logo Section */}
        <LogoSection />
        
        {/* Color Selection */}
        <ColorSelection />
        
        {/* Contact Information */}
        <ContactSection />
        
        {/* Address Information */}
        <AddressSection />
      </div>
      
      {/* Navigation Buttons */}
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default BrandingContactStep;
