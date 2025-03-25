
import React from "react";
import { Button } from "@/components/ui/button";
import { ContactMethod } from "./types";
import { scrollToElementIfAnchor } from "./contact-utils";

interface PrimaryContactMethodProps {
  method: ContactMethod;
  onInteraction?: (id: string) => void;
}

export const PrimaryContactMethod: React.FC<PrimaryContactMethodProps> = ({ 
  method,
  onInteraction = () => {} 
}) => {
  const handleClick = () => {
    scrollToElementIfAnchor(method.href);
    onInteraction(method.id);
  };

  return (
    <div className="bg-card border shadow-sm rounded-lg p-5 mb-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start">
        <div className="bg-primary/10 p-3 rounded-full mr-4">
          {method.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{method.label}</h4>
          <p className="text-muted-foreground mb-3">{method.prompt}</p>
          <Button 
            className="mt-2 group" 
            size="lg"
            onClick={handleClick}
            {...(method.href.startsWith('#') ? {} : { as: 'a', href: method.href })}
          >
            {method.action}
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">
              {method.icon}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
