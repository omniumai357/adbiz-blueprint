
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormValidationMessageProps {
  message: string | null;
}

export const FormValidationMessage = ({ message }: FormValidationMessageProps) => {
  if (!message) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
