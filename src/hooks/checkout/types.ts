
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";

export type PaymentMethod = "credit-card" | "paypal";

export interface CheckoutState {
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  showDownloadOptions: boolean;
  orderId: string | null;
  invoiceNumber: string | null;
  isGeneratingInvoice: boolean;
  userId: string | null;
  selectedAddOnIds: string[];
}

export interface PackageDetails {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
}
