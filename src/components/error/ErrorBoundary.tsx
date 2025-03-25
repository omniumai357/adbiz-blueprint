
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/ui/use-toast";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<
  ErrorBoundaryProps & { showErrorToast: (error: Error) => void },
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps & { showErrorToast: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    this.props.showErrorToast(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center rounded-lg border bg-background/50">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <Button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = window.location.pathname;
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide toast context to class component
export const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const { toast } = useToast();

  const showErrorToast = (error: Error) => {
    toast({
      title: "An error occurred",
      description: "We've logged this issue and are working to fix it.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return <ErrorBoundaryClass {...props} showErrorToast={showErrorToast} />;
};

export default ErrorBoundary;
