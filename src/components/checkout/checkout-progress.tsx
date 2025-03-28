
import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CreditCardIcon, CircleIcon, PackageIcon, ShoppingCartIcon } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";

export type CheckoutStep = "cart" | "information" | "payment" | "confirmation";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  className?: string;
}

/**
 * A responsive checkout progress component
 * Shows the user where they are in the checkout flow
 */
const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  currentStep,
  className
}) => {
  const { isMobile } = useResponsive();
  
  const steps: Array<{
    id: CheckoutStep;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "cart",
      label: "Cart",
      icon: <ShoppingCartIcon className="h-4 w-4" />
    },
    {
      id: "information",
      label: "Information",
      icon: <PackageIcon className="h-4 w-4" />
    },
    {
      id: "payment",
      label: "Payment",
      icon: <CreditCardIcon className="h-4 w-4" />
    },
    {
      id: "confirmation",
      label: "Confirmation",
      icon: <CheckIcon className="h-4 w-4" />
    }
  ];
  
  // Calculate step status: completed, current, or upcoming
  const getStepStatus = (stepId: CheckoutStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };
  
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-200",
                  status === "completed" ? "bg-primary text-primary-foreground" :
                  status === "current" ? "bg-primary/20 text-primary border-2 border-primary" :
                  "bg-muted text-muted-foreground"
                )}>
                  {status === "completed" ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                {/* Step label - hide on mobile */}
                {!isMobile && (
                  <span className={cn(
                    "text-xs mt-1 text-center transition-colors",
                    status === "completed" ? "text-primary font-medium" :
                    status === "current" ? "text-primary font-bold" :
                    "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                )}
              </div>
              
              {/* Connector line */}
              {!isLast && (
                <div className={cn(
                  "flex-1 h-0.5 relative",
                  status === "completed" ? "bg-primary" :
                  status === "current" ? "bg-gradient-to-r from-primary to-muted" :
                  "bg-muted"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
