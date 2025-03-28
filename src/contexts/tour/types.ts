import { ReactNode } from "react";

// Customer Information Types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  invoiceDeliveryMethod: "email" | "sms" | "both";
  userId?: string;
}

export interface CustomerInfoFormProps {
  customerInfo: Partial<CustomerInfo>;
  onChange: (values: Partial<CustomerInfo>) => void;
  isLoading?: boolean;
}

export interface CustomerBusinessInfoProps {
  form: any; // Replace with the actual form type when available
}

export interface CustomerPersonalInfoProps {
  form: any; // Replace with the actual form type when available
  phoneRequired: boolean;
}

export interface InvoiceDeliveryOptionsProps {
  form: any; // Replace with the actual form type when available
}

// Payment Related Types
export type PaymentMethod = "credit-card" | "paypal";

export interface PaymentOptionProps {
  id: string;
  value: string; 
  label: string;
  icon: ReactNode;
  isSelected: boolean;
}

// Checkout State Types
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

// Package Details Types
export interface PackageDetails {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  category?: string; // Added this property to match the Package interface
}

// Add-On Types
export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Discount Types
export interface BundleDiscountInfo {
  title: string;
  description: string;
  percentage: number;
}

export interface TourStepAction {
  text?: string;
  hidden?: boolean;
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement?:
    | "auto"
    | "auto-start"
    | "auto-end"
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  animation?: "fade" | "slide-in-bottom" | "slide-in-top" | "slide-in-left" | "slide-in-right";
  media?: {
    type: 'image' | 'video';
    source: string;
  };
  actions?: {
    next?: TourStepAction;
    prev?: TourStepAction;
    skip?: TourStepAction;
  };
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
  loop?: boolean;
  isCompleted?: boolean;
}

export interface TourContextValue {
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  isActive: boolean;
  isCompleted: boolean;
  startTour: (tourId?: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  registerTour: (tourConfig: TourConfig) => void;
  unregisterTour: (tourId: string) => void;
  updateTourConfig: (tourId: string, config: Partial<TourConfig>) => void;
  getTourConfig: (tourId: string) => TourConfig | undefined;
  getAllTours: () => TourConfig[];
  markTourAsCompleted: (tourId: string) => void;
  resetCompletedTours: () => void;
  isTourCompleted: (tourId: string) => boolean;
  activeTourId: string | null;
}
