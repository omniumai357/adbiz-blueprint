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
  label?: string;
  hidden?: boolean;
  callback?: () => void;
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  elementId?: string;
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
  position?: string;
  animation?: "fade" | "slide-in-bottom" | "slide-in-top" | "slide-in-left" | "slide-in-right";
  isHidden?: boolean;
  condition?: () => boolean;
  order?: number;
  metadata?: Record<string, any>;
  path?: {
    enabled: boolean;
    targetElementId: string;
    style?: string;
  } | string;
  dependencies?: string[];
  isOptional?: boolean;
  userRoles?: string[];
  triggers?: string[];
  priority?: number;
  floatingUIOptions?: any;
  media?: {
    type: 'image' | 'video';
    source: string;
    alt?: string;
  };
  actions?: {
    next?: TourStepAction;
    prev?: TourStepAction;
    skip?: TourStepAction;
    finish?: TourStepAction;
    close?: TourStepAction;
  };
}

export interface TourPath {
  id: string;
  name: string;
  description?: string;
  steps: TourStep[];
  route?: string;
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  config?: {
    metadata?: Record<string, any>;
  };
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
  loop?: boolean;
  isCompleted?: boolean;
}

export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  currentPath: string | null;
  currentPathData: TourPath | undefined;
  tourPaths: TourPath[];
  availablePaths: TourPath[];
  
  // Tour navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  startTour: (pathId: string) => void;
  endTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  resetTour: () => void;
  goToPath: (pathId: string) => void;
  
  // Tour state management
  registerPath: (path: TourPath) => void;
  unregisterPath: (pathId: string) => void;
  setDynamicContent: (stepId: string, content: string) => void;
  setAvailablePaths: (paths: TourPath[]) => void;
  
  // Custom configuration
  customConfig: Record<string, any>;
  setCustomConfig: (config: Record<string, any>) => void;
  
  // Additional properties
  handleKeyNavigation: (event: React.KeyboardEvent | KeyboardEvent, navigationAction?: string) => void;
  visibleSteps: TourStep[];
  content: string;
  
  // Tour paths management
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>;
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>;
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
