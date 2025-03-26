
export const checkoutTourPath = {
  id: "checkout-tour",
  name: "Checkout Page Tour",
  steps: [
    {
      id: "welcome",
      elementId: "checkout-header",
      title: "Welcome to Checkout",
      content: "This is the checkout page where you can complete your purchase. Let's walk through the process.",
      position: "bottom" as const
    },
    {
      id: "customer-info",
      elementId: "customer-info-section",
      title: "Customer Information",
      content: "Here you can enter your personal and business details. This information will be used for your invoice.",
      position: "right" as const
    },
    {
      id: "add-ons",
      elementId: "add-ons-section",
      title: "Service Add-ons",
      content: "Enhance your package with these optional add-ons. Select any that might benefit your business.",
      position: "left" as const
    },
    {
      id: "discounts",
      elementId: "discounts-section",
      title: "Available Discounts",
      content: "View applicable discounts and special offers. You can also enter coupon codes here.",
      position: "top" as const
    },
    {
      id: "payment-methods",
      elementId: "payment-method-section",
      title: "Payment Methods",
      content: "Choose your preferred payment method to complete your purchase.",
      position: "left" as const
    },
    {
      id: "order-summary",
      elementId: "order-summary-section",
      title: "Order Summary",
      content: "Review your order details, including selected package, add-ons, and total cost before finalizing.",
      position: "right" as const
    }
  ]
};
