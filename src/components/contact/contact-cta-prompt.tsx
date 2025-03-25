
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPrioritizedMethods } from "./contact-methods";
import { PrimaryContactMethod } from "./primary-contact-method";
import { SecondaryContactMethods } from "./secondary-contact-methods";
import { showInfoToast } from "@/utils/toast-utils";

export const ContactCtaPrompt = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source") || "";
  const topic = queryParams.get("topic") || "";
  const category = queryParams.get("category") || "";
  
  // Detect current page as a fallback source
  const currentPath = location.pathname;
  const detectedSource = source || (
    currentPath.includes('/services') ? 'services' :
    currentPath.includes('/blog') ? 'blog' :
    currentPath.includes('/pricing') ? 'pricing' : ''
  );
  
  // Get prioritized contact methods based on context
  const prioritizedMethods = getPrioritizedMethods(detectedSource, topic, category);
  
  // Get the top method for the main CTA
  const primaryMethod = prioritizedMethods[0];
  // Get the next 2 methods for secondary CTAs
  const secondaryMethods = prioritizedMethods.slice(1, 3);
  
  // Animation entry effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Track CTA interactions
  const trackInteraction = (methodId: string) => {
    // In a real app, this would send analytics
    console.log(`CTA interaction: ${methodId} from ${detectedSource || 'direct'}`);
    
    // Show feedback to user
    showInfoToast(
      "Contact option selected",
      `We'll help you through your preferred ${methodId} channel.`
    );
  };
  
  return (
    <div 
      className={`bg-gradient-to-r from-muted/50 to-background p-6 rounded-lg mb-8 border shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h3 className="text-xl font-bold mb-4">
        {detectedSource === 'services' 
          ? `How Can We Help With Your ${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Advertising'} Needs?` 
          : 'How Can We Help You?'}
      </h3>
      
      {/* Primary CTA */}
      <PrimaryContactMethod 
        method={primaryMethod} 
        onInteraction={() => trackInteraction(primaryMethod.id)}
      />
      
      {/* Secondary CTAs */}
      <SecondaryContactMethods 
        methods={secondaryMethods} 
        onInteraction={trackInteraction} 
      />
    </div>
  );
};
