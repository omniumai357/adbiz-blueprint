
import React from "react";
import { Button } from "@/components/ui/button";
import { ContactMethod } from "./types";
import { scrollToElementIfAnchor } from "./contact-utils";

interface SecondaryContactMethodsProps {
  methods: ContactMethod[];
}

export const SecondaryContactMethods: React.FC<SecondaryContactMethodsProps> = ({ methods }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <div key={method.id} className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="bg-background p-2 rounded-full mr-2">
              {method.icon}
            </div>
            <h4 className="font-medium">{method.label}</h4>
          </div>
          <p className="text-muted-foreground text-sm mb-3">{method.prompt}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => scrollToElementIfAnchor(method.href)}
            {...(method.href.startsWith('#') ? {} : { as: 'a', href: method.href })}
          >
            {method.action}
          </Button>
        </div>
      ))}
    </div>
  );
};
