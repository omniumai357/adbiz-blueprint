
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { logError } from "@/utils/error-handling";

interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorTitle?: string;
  errorDescription?: string;
  onReset?: () => void;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced Error Boundary for gracefully handling React component errors
 * 
 * Features:
 * - Catches errors in React component tree
 * - Provides fallback UI or default error display
 * - Logs errors to console with stack traces
 * - Allows for custom error reset behavior
 * - Shows toast notifications for errors
 * 
 * Usage:
 * Wrap components that might throw errors with this boundary
 * <AppErrorBoundary>
 *   <ComponentThatMightFail />
 * </AppErrorBoundary>
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error with our standardized error logging
    logError(error, "React Component Error");
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState({ errorInfo });
    
    // Show toast notification
    toast.error("An error occurred", {
      description: error.message || "Something went wrong. Please try again.",
      duration: 5000
    });
  }

  handleReset = () => {
    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, errorTitle, errorDescription } = this.props;
    
    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <Card className="border-destructive/50 shadow-lg">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {errorTitle || "Something went wrong"}
            </CardTitle>
            <CardDescription>
              {errorDescription || "We encountered an unexpected error. Our team has been notified."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto max-h-32">
                {error.message}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="secondary" 
              onClick={this.handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button onClick={this.handleReload}>
              Reload page
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return children;
  }
}

/**
 * Functional wrapper for AppErrorBoundary
 * Makes it easier to use in functional components
 */
export default function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<AppErrorBoundaryProps, 'children'>
): React.FC<P> {
  return (props: P) => (
    <AppErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AppErrorBoundary>
  );
}
