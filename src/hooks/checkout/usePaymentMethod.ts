import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "./types";

export function usePaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  
  return {
    paymentMethod,
    setPaymentMethod
  };
}
