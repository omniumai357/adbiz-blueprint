
import { useState } from "react";
import { PaymentMethod } from "./types";

export function usePaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  
  return {
    paymentMethod,
    setPaymentMethod
  };
}
