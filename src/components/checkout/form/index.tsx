
import React from "react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import CheckoutForm from "../checkout-form";

// Wrap the checkout form with error boundary for better error handling
const CheckoutFormWithErrorHandling = (props: React.ComponentProps<typeof CheckoutForm>) => {
  return (
    <ErrorBoundary>
      <CheckoutForm {...props} />
    </ErrorBoundary>
  );
};

export default CheckoutFormWithErrorHandling;
