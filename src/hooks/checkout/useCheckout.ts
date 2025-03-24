import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import { useProfile } from "@/hooks/data/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";
import { LimitedTimeOfferInfo } from "@/components/checkout/limited-time-offer";
import { useMilestoneRewards } from "./useMilestoneRewards";
import { useCheckoutCalculations } from "./useCheckoutCalculations";
import { UserMilestone } from "../rewards/useMilestones";

interface CustomerInfo {
  userId?: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  invoiceDeliveryMethod?: "email" | "sms" | "both";
}

export function useCheckout() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [availableAddOns, setAvailableAddOns] = useState<AddOnItem[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [bundleDiscount, setBundleDiscount] = useState<BundleDiscountInfo | undefined>(undefined);
  const [isDiscountApplicable, setIsDiscountApplicable] = useState<boolean>(false);
  const [appliedTier, setAppliedTier] = useState<any>(null);
  const [isFirstPurchase, setIsFirstPurchase] = useState<boolean>(false);
  const [isLoyaltyProgramEnabled, setIsLoyaltyProgramEnabled] = useState<boolean>(false);
  const [loyaltyBonusAmount, setLoyaltyBonusAmount] = useState<number>(0);
  const [activeOffers, setActiveOffers] = useState<LimitedTimeOfferInfo[]>([]);
  const [availableOffer, setAvailableOffer] = useState<LimitedTimeOfferInfo | null>(null);
  const [personalizedCoupon, setPersonalizedCoupon] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId") || undefined;
  const packageId = searchParams.get("packageId") || "0";
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState(0);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const { profile, isLoading: isProfileLoading } = useProfile(userId);

  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        userId: profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        company: profile.company || "",
        email: "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("id", packageId)
          .single();

        if (error) {
          throw error;
        }

        setPackageDetails(data);
        setPackageName(data.title);
        setPackagePrice(data.price);
      } catch (error) {
        console.error("Error fetching package:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch package details.",
        });
      }
    };

    fetchPackage();
  }, [packageId, toast]);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const { data: addonsData, error: addonsError } = await supabase
          .from("packages")
          .select("*")
          .eq("category", "add-on");

        if (addonsError) {
          throw addonsError;
        }

        if (addonsData && Array.isArray(addonsData)) {
          const addOns: AddOnItem[] = addonsData.map((addon) => ({
            id: addon.id,
            name: addon.title,
            description: addon.description,
            price: addon.price,
          }));
          setAvailableAddOns(addOns);
        } else {
          console.warn("No add-ons found or invalid data format.");
          setAvailableAddOns([]);
        }
      } catch (error) {
        console.error("Error fetching add-ons:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch available add-ons.",
        });
      }
    };

    fetchAddOns();
  }, [toast]);

  const handleAddOnToggle = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((addOnId) => addOnId !== id) : [...prev, id]
    );
  };

  const handleLoyaltyProgramToggle = () => {
    setIsLoyaltyProgramEnabled((prev) => !prev);
  };

  const applyCoupon = async (code: string) => {
    setIsCheckingCoupon(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.active && new Date(data.valid_until) > new Date()) {
        setAppliedCoupon(data);
        toast({
          title: "Coupon Applied!",
          description: `Coupon ${code} applied successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: "This coupon is either invalid or expired.",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
      });
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "The applied coupon has been removed.",
    });
  };
  
  const { 
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    calculateMilestoneRewardAmount,
    awardMilestonePoints
  } = useMilestoneRewards(userId, 0);

  const {
    addOnsTotal,
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
    couponDiscountAmount,
    milestoneRewardAmount,
    totalDiscountAmount,
    total
  } = useCheckoutCalculations({
    packagePrice,
    selectedAddOns: availableAddOns.filter(addon => selectedAddOnIds.includes(addon.id)),
    bundleDiscount,
    isDiscountApplicable,
    tieredDiscount: appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    availableOffer,
    appliedCoupon,
    appliedMilestoneReward
  });

  const handleOrderSuccess = async (orderId: string) => {
    setShowDownloadOptions(true);
    setOrderId(orderId);

    const newInvoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    setInvoiceNumber(newInvoiceNumber);

    toast({
      title: "Order Successful!",
      description: "Your order has been placed successfully.",
    });

    if (userId) {
      await awardMilestonePoints(orderId, total);
    }

    setIsGeneratingInvoice(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGeneratingInvoice(false);

    setTimeout(() => {
      navigate(`/download?orderId=${orderId}&invoiceNumber=${newInvoiceNumber}`);
    }, 5000);
  };

  const selectedAddOns = availableAddOns.filter(addon => selectedAddOnIds.includes(addon.id));

  return {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    handleOrderSuccess,
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    bundleDiscount,
    isDiscountApplicable,
    appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    activeOffers,
    availableOffer,
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    isLoading: false,
    addOnsTotal,
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
    milestoneRewardAmount,
    totalDiscountAmount,
    total,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
  };
}
