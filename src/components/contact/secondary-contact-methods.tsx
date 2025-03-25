
import React from "react";
import { Button } from "@/components/ui/button";
import { ContactMethod } from "./types";
import { scrollToElementIfAnchor } from "./contact-utils";

interface SecondaryContactMethodsProps {
  methods: ContactMethod[];
  onInteraction?: (id: string) => void;
}

export const SecondaryContactMethods: React.FC<SecondaryContactMethodsProps> = ({ 
  methods,
  onInteraction = () => {}
}) => {
  const handleClick = (method: ContactMethod) => {
    scrollToElementIfAnchor(method.href);
    onInteraction(method.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <div 
          key={method.id}
          className="bg-background hover:bg-muted/30 border rounded-lg p-4 transition-all duration-300"
        >
          <div className="flex items-center mb-2">
            <div className="mr-2 text-primary">{method.icon}</div>
            <h5 className="font-medium">{method.label}</h5>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{method.prompt}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-center group"
            onClick={() => handleClick(method)}
            {...(method.href.startsWith('#') ? {} : { as: 'a', href: method.href })}
          >
            {method.action}
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">
              {method.icon}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};
