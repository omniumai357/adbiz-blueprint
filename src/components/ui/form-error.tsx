
import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type ErrorSeverity = "error" | "warning" | "info";

interface FormErrorProps {
  message: string | null | undefined;
  severity?: ErrorSeverity;
  className?: string;
}

export const FormError = ({ 
  message, 
  severity = "error",
  className 
}: FormErrorProps) => {
  if (!message) return null;
  
  // Choose icon based on severity
  const Icon = severity === "warning" ? AlertTriangle : AlertCircle;
  
  // Choose variant based on severity
  const variant = severity === "error" ? "destructive" : 
                 severity === "warning" ? "default" : "default";
  
  // Base styling for all alerts
  const baseStyles = "mb-4 text-sm";
  
  // Additional styling based on severity
  const severityStyles = severity === "warning" ? "border-amber-500 text-amber-700" :
                        severity === "info" ? "border-blue-500 text-blue-700" : "";
  
  return (
    <Alert 
      variant={variant} 
      className={cn(baseStyles, severityStyles, className)}
    >
      <Icon className="h-4 w-4 mr-2" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default FormError;
