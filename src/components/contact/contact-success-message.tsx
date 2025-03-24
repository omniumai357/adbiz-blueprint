
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactSuccessMessageProps } from "@/types/contact";

export const ContactSuccessMessage = ({ onReset }: ContactSuccessMessageProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
      <p className="text-muted-foreground mb-6">
        Your message has been received. We'll get back to you as soon as possible.
      </p>
      <Button 
        onClick={onReset}
        variant="outline"
      >
        Send Another Message
      </Button>
    </div>
  );
};
