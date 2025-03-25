
import { useState } from "react";

export function usePaymentOptions() {
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");

  return {
    paymentMethod,
    setPaymentMethod
  };
}
