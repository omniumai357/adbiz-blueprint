
import { useState } from "react";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";
import { LimitedTimeOfferInfo } from "@/components/checkout/limited-time-offer";

export function useDiscountState() {
  const [bundleDiscount, setBundleDiscount] = useState<BundleDiscountInfo | undefined>(undefined);
  const [isDiscountApplicable, setIsDiscountApplicable] = useState<boolean>(false);
  const [appliedTier, setAppliedTier] = useState<any>(null);
  const [isFirstPurchase, setIsFirstPurchase] = useState<boolean>(false);
  const [activeOffers, setActiveOffers] = useState<LimitedTimeOfferInfo[]>([]);
  const [availableOffer, setAvailableOffer] = useState<LimitedTimeOfferInfo | null>(null);
  const [personalizedCoupon, setPersonalizedCoupon] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  return {
    bundleDiscount,
    isDiscountApplicable,
    appliedTier,
    isFirstPurchase,
    activeOffers,
    availableOffer,
    personalizedCoupon,
    appliedCoupon,
    isCheckingCoupon,
    setBundleDiscount,
    setIsDiscountApplicable,
    setAppliedTier,
    setIsFirstPurchase,
    setActiveOffers,
    setAvailableOffer,
    setPersonalizedCoupon,
    setAppliedCoupon,
    setIsCheckingCoupon
  };
}
