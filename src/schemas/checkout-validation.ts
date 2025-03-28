
import { z } from "zod";

export const customerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  invoiceDeliveryMethod: z.enum(["email", "sms", "both"]),
  userId: z.string().optional()
});

export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be at least 16 digits")
    .refine((value) => /^(\d{4}\s?){3}\d{4}$/.test(value.replace(/\s/g, '')), {
      message: "Invalid card number format",
    }),
  cardName: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string()
    .min(5, "Expiry date is required")
    .refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), {
      message: "Expiry date must be in MM/YY format",
    })
    .refine((value) => {
      const [month, year] = value.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      const expYear = parseInt(year, 10);
      const expMonth = parseInt(month, 10);
      
      // Check if the card is not expired
      return expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth);
    }, {
      message: "Card is expired",
    }),
  cvv: z.string()
    .min(3, "CVV is required")
    .max(4, "CVV cannot exceed 4 digits")
    .refine((value) => /^\d{3,4}$/.test(value), {
      message: "CVV must be 3 or 4 digits",
    }),
});

export type CardPaymentFormValues = z.infer<typeof cardPaymentSchema>;
export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
