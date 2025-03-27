
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info } from "lucide-react";

type AuthMessageProps = {
  message?: string;
  title?: string;
  variant?: 'success' | 'info' | 'error';
};

export function AuthMessage({ message, title, variant = 'success' }: AuthMessageProps) {
  if (!message) return null;

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'info':
      case 'error':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (variant) {
      case 'error':
        return 'destructive';
      case 'success':
      case 'info':
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-6">
      {title && <AlertTitle className="flex items-center gap-2">
        {getIcon()}
        {title}
      </AlertTitle>}
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};
