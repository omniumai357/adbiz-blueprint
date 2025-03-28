
import { CustomerInfo, PackageDetails } from "@/types/checkout";
import { Profile } from "@/types/api";

/**
 * Type definitions for the checkout hooks
 */

export interface CheckoutOrderDetails {
  showDownloadOptions: boolean;
  orderId: string | null;
  invoiceNumber: string | null;
  isGeneratingInvoice: boolean;
  userId: string;
  packageName: string;
  packagePrice: number;
  packageDetails: PackageDetails;
  isProfileLoading: boolean;
  profile: Profile;
  handleOrderSuccess: (orderId: string) => void;
}

export type PaymentMethod = "credit-card" | "paypal";

export interface CheckoutState {
  customerInfo: Partial<CustomerInfo>;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export interface CheckoutAddOns {
  available: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
  }>;
  selected: string[];
  selectedItems: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
  }>;
  total: number;
  toggle: (addonId: string) => void;
}

export interface CheckoutTotals {
  addOnsTotal: number;
  subtotal: number;
  total: number;
  recalculate: () => void;
}

export interface CheckoutDiscount {
  bundle: {
    info: any;
    applicable: boolean;
    amount: number;
  };
  tiered: {
    info: any;
    isFirstPurchase: boolean;
    amount: number;
  };
  loyalty: {
    enabled: boolean;
    toggle: () => void;
    amount: number;
    updateBonus: (subtotal: number) => void;
  };
  offers: {
    active: any[];
    available: any;
    amount: number;
  };
  coupons: {
    personal: any;
    applied: any;
    amount: number;
    isChecking: boolean;
    apply: (code: string) => void;
    remove: () => void;
    updateAmount: (subtotal: number) => void;
  };
  rewards: {
    applied: any;
    applyReward: (reward: any) => void;
    amount: number;
    handleOrderSuccess: (orderId: string, orderTotal: number) => Promise<void>;
  };
  total: number;
  getTotalDiscount: () => number;
}

export interface ConsolidatedCheckout {
  orderDetails: CheckoutOrderDetails;
  isLoading: boolean;
  isProfileLoading: boolean;
  orderId: string | null;
  showDownloadOptions: boolean;
  invoiceNumber: string | null;
  isGeneratingInvoice: boolean;
  packageDetails: PackageDetails;
  customerInfo: Partial<CustomerInfo>;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  addOns: CheckoutAddOns;
  discounts: CheckoutDiscount;
  totals: CheckoutTotals;
  handleOrderSuccess: (orderId: string) => void;
}
