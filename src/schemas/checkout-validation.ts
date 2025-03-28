
import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils/validation-utils";

export const customerInfoSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .trim(),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .trim(),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  phone: z.string()
    .optional()
    .refine(val => !val || isValidPhoneNumber(val), {
      message: "Please enter a valid phone number"
    }),
  company: z.string().optional(),
  website: z.string().optional(),
  invoiceDeliveryMethod: z.enum(["email", "sms", "both"])
})
.refine(data => {
  if (data.invoiceDeliveryMethod === "sms" || data.invoiceDeliveryMethod === "both") {
    return !!data.phone;
  }
  return true;
}, {
  message: "Phone number is required for SMS delivery",
  path: ["phone"]
});

export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .min(13, { message: "Card number is too short" })
    .max(19, { message: "Card number is too long" })
    .refine(val => /^[0-9\s]+$/.test(val), {
      message: "Card number can only contain digits and spaces"
    })
    .refine(val => {
      // Basic Luhn algorithm check for credit card validation
      const digits = val.replace(/\s/g, "");
      if (!/^\d+$/.test(digits)) return false;
      
      let sum = 0;
      let shouldDouble = false;
      
      // Loop through digits in reverse order
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return sum % 10 === 0;
    }, {
      message: "Please enter a valid card number"
    }),
  cardName: z.string()
    .min(3, { message: "Please enter the full name as it appears on the card" })
    .trim(),
  expiryDate: z.string()
    .min(5, { message: "Please enter a valid expiry date (MM/YY)" })
    .refine(val => /^\d{2}\/\d{2}$/.test(val), {
      message: "Expiry date must be in MM/YY format"
    })
    .refine(val => {
      // Check if expiry date is in the future
      const [month, year] = val.split("/");
      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10) + 2000; // Convert YY to 20YY
      
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
      const currentYear = now.getFullYear();
      
      if (expYear < currentYear) return false;
      if (expYear === currentYear && expMonth < currentMonth) return false;
      if (expMonth < 1 || expMonth > 12) return false;
      
      return true;
    }, {
      message: "Card has expired"
    }),
  cvv: z.string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV cannot be more than 4 digits" })
    .refine(val => /^\d+$/.test(val), {
      message: "CVV can only contain digits"
    })
});

export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
export type CardPaymentFormValues = z.infer<typeof cardPaymentSchema>;
