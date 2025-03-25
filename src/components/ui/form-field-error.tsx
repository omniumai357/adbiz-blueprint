
import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldErrorProps {
  message?: string | null;
  className?: string;
}

/**
 * Component to display an error message for a form field
 * 
 * More compact than FormError, designed to be displayed underneath form inputs
 */
export const FormFieldError = ({ 
  message, 
  className 
}: FormFieldErrorProps) => {
  if (!message) return null;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-destructive text-sm mt-1.5", 
      className
    )}>
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormFieldError;
