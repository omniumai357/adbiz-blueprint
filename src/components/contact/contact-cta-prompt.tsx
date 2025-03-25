
import React from "react";
import { useLocation } from "react-router-dom";
import { getPrioritizedMethods } from "./contact-methods";
import { PrimaryContactMethod } from "./primary-contact-method";
import { SecondaryContactMethods } from "./secondary-contact-methods";

export const ContactCtaPrompt = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source") || "";
  const topic = queryParams.get("topic") || "";
  
  const prioritizedMethods = getPrioritizedMethods(source, topic);
  
  // Get the top method for the main CTA
  const primaryMethod = prioritizedMethods[0];
  // Get the next 2 methods for secondary CTAs
  const secondaryMethods = prioritizedMethods.slice(1, 3);
  
  return (
    <div className="bg-gradient-to-r from-muted/50 to-background p-6 rounded-lg mb-8">
      <h3 className="text-xl font-bold mb-4">How Can We Help You?</h3>
      
      {/* Primary CTA */}
      <PrimaryContactMethod method={primaryMethod} />
      
      {/* Secondary CTAs */}
      <SecondaryContactMethods methods={secondaryMethods} />
    </div>
  );
};
