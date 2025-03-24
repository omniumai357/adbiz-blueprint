
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthMessageProps = {
  message: string | undefined;
};

export function AuthMessage({ message }: AuthMessageProps) {
  if (!message) return null;
  
  return (
    <Alert className="mb-6 bg-primary/10 border-primary/20">
      <Info className="h-4 w-4 text-primary" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
