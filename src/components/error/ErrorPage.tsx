
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  error?: Error | null;
}

/**
 * Full-page error display component
 * 
 * Used for route-level errors or application-wide failures
 */
const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Something went wrong",
  message = "We're sorry, but we encountered an unexpected error.",
  showHomeButton = true,
  showRetryButton = true,
  error
}) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        
        {error && (
          <div className="mb-6 p-4 bg-muted rounded-md text-sm text-left overflow-auto max-h-40">
            <p className="font-semibold">{error.name}</p>
            <p className="font-mono">{error.message}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showHomeButton && (
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          )}
          
          {showRetryButton && (
            <Button 
              variant="outline" 
              onClick={handleRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
