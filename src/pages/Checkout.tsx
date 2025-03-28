
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSuccess from "@/components/checkout/checkout-success";
import CheckoutProgress from "@/components/checkout/checkout-progress";
import { useService } from "@/hooks/services/useService";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { PackageDetails } from "@/types/checkout";
import { useCheckoutConsolidated } from "@/hooks/checkout/useCheckoutConsolidated";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";
import { LimitedTimeOfferInfo } from "@/components/checkout/limited-time-offer";
import { UserMilestone } from "@/hooks/rewards/useMilestones";
import { UserMilestone as ApiUserMilestone } from "@/types/api";
import { CouponInfo } from "@/hooks/checkout/useCoupons";
import ResponsiveCheckoutLayout from "@/components/checkout/responsive-checkout-layout";
import { toast } from "sonner";

type CheckoutStep = "information" | "payment" | "confirmation";

/**
 * Enhanced Checkout Page Component
 * 
 * Handles the complete checkout flow with a simplified approach,
 * progress indicator, and improved error handling
 */
const Checkout = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { data } = useAuthUser();
  const userId = data?.user?.id;
  const api = useService('api');
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [isLoadingPackage, setIsLoadingPackage] = useState(true);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  
  // Fetch package details with improved error handling
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) return;
      
      try {
        setIsLoadingPackage(true);
        const packageData = await api.packages.getPackageById(packageId);
        setPackageDetails(packageData);
      } catch (error) {
        console.error("Error fetching package details:", error);
        toast.error("Failed to load package details", {
          description: "Please try refreshing the page or contact support if the issue persists."
        });
      } finally {
        setIsLoadingPackage(false);
      }
    };
    
    fetchPackageDetails();
  }, [packageId, api]);
  
  // Use the consolidated checkout hook
  const checkout = useCheckoutConsolidated(
    packageDetails || { id: "", title: "", price: 0, description: "", features: [] },
    userId
  );
  
  // Progress to next step
  const handleNextStep = (step: CheckoutStep) => {
    setCurrentStep(step);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active checkout step based on state
  useEffect(() => {
    if (checkout.showDownloadOptions && checkout.orderId) {
      setCurrentStep("confirmation");
    }
  }, [checkout.showDownloadOptions, checkout.orderId]);
  
  // Custom order success handler
  const handleOrderSuccess = (id: string) => {
    checkout.handleOrderSuccess(id);
    handleNextStep("confirmation");
  };
  
  if (isLoadingPackage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16">
          <ResponsiveCheckoutLayout
            summary={<Skeleton className="h-64 w-full" />}
            form={<Skeleton className="h-96 w-full" />}
          />
        </main>
      </div>
    );
  }
  
  if (!packageDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16">
          <ResponsiveCheckoutLayout
            summary={<Skeleton className="h-64 w-full" />}
            form={
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-xl font-semibold text-red-700">Package Not Found</h2>
                <p className="mt-2 text-red-600">We couldn't find the package you're looking for.</p>
              </div>
            }
          />
        </main>
      </div>
    );
  }
  
  // Map the coupon info to the expected format for OrderSummary
  const mapCouponInfoToSummaryFormat = (coupon: CouponInfo | null) => {
    if (!coupon) return null;
    
    return {
      code: coupon.code,
      discount: coupon.discountPercentage || 0,
      id: coupon.id || "coupon-id",
      name: coupon.description || "Coupon",
      discountAmount: coupon.discountAmount || 0,
    };
  };

  // Order summary component
  const summaryComponent = (
    <OrderSummary 
      packageName={packageDetails.title} 
      packagePrice={packageDetails.price}
      selectedAddOns={checkout.addOns.selectedItems}
      appliedDiscount={checkout.discounts.bundle.info as BundleDiscountInfo}
      tieredDiscount={checkout.discounts.tiered.info as {
        id: string;
        name: string;
        discountAmount: number;
        firstPurchaseBonus?: number;
      }}
      isFirstPurchase={checkout.discounts.tiered.isFirstPurchase}
      bundleDiscountAmount={checkout.discounts.bundle.amount}
      tieredDiscountAmount={checkout.discounts.tiered.amount}
      loyaltyBonusAmount={checkout.discounts.loyalty.amount}
      totalDiscountAmount={checkout.discounts.total}
      invoiceNumber={checkout.invoiceNumber}
      isLoyaltyProgramEnabled={checkout.discounts.loyalty.enabled}
      limitedTimeOffer={checkout.discounts.offers.available as unknown as LimitedTimeOfferInfo}
      offerDiscountAmount={checkout.discounts.offers.amount}
      appliedCoupon={checkout.discounts.coupons.applied ? mapCouponInfoToSummaryFormat(checkout.discounts.coupons.applied) : null}
      couponDiscountAmount={checkout.discounts.coupons.amount}
      appliedMilestoneReward={checkout.discounts.rewards.applied as unknown as UserMilestone}
      milestoneRewardAmount={checkout.discounts.rewards.amount}
    />
  );

  // Form or success component
  const formOrSuccessComponent = checkout.showDownloadOptions && checkout.orderId ? (
    <CheckoutSuccess 
      orderId={checkout.orderId}
      packageName={packageDetails.title}
      invoiceNumber={checkout.invoiceNumber}
      isGeneratingInvoice={checkout.isGeneratingInvoice}
      userId={userId}
    />
  ) : (
    <>
      <CheckoutProgress 
        currentStep={currentStep === "information" ? "information" : "payment"} 
        className="mb-6"
      />
      <CheckoutForm 
        checkout={checkout}
        onOrderSuccess={handleOrderSuccess}
        currentStep={currentStep}
        onNextStep={handleNextStep}
      />
    </>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">Checkout</h1>
        <ResponsiveCheckoutLayout
          summary={summaryComponent}
          form={formOrSuccessComponent}
        />
      </main>
    </div>
  );
};

export default Checkout;
