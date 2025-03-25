
import React from "react";
import { Button } from "@/components/ui/button";
import { ContactMethod } from "./types";
import { scrollToElementIfAnchor } from "./contact-utils";

interface PrimaryContactMethodProps {
  method: ContactMethod;
}

export const PrimaryContactMethod: React.FC<PrimaryContactMethodProps> = ({ method }) => {
  return (
    <div className="bg-card border shadow-sm rounded-lg p-5 mb-4">
      <div className="flex items-start">
        <div className="bg-primary/10 p-3 rounded-full mr-4">
          {method.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{method.label}</h4>
          <p className="text-muted-foreground mb-3">{method.prompt}</p>
          <Button 
            className="mt-2" 
            size="lg"
            onClick={() => scrollToElementIfAnchor(method.href)}
            {...(method.href.startsWith('#') ? {} : { as: 'a', href: method.href })}
          >
            {method.action}
            {method.icon}
          </Button>
        </div>
      </div>
    </div>
  );
};
