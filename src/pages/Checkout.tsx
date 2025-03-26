
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSuccess from "@/components/checkout/checkout-success";
import { useService } from "@/hooks/services/useService";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { PackageDetails } from "@/types/checkout";
import { useCheckoutConsolidated } from "@/hooks/checkout/useCheckoutConsolidated";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";

/**
 * Checkout Page Component
 * 
 * Handles the complete checkout flow with a simplified approach using the
 * consolidated checkout hook for cleaner state management and data flow.
 */
const Checkout = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { data: userData } = useAuthUser();
  const userId = userData?.user?.id;
  const api = useService('api');
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [isLoadingPackage, setIsLoadingPackage] = useState(true);
  
  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) return;
      
      try {
        setIsLoadingPackage(true);
        const packageData = await api.packages.getPackageById(packageId);
        setPackageDetails(packageData);
      } catch (error) {
        console.error("Error fetching package details:", error);
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
  
  if (isLoadingPackage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16">
          <div className="container px-4 mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }
  
  if (!packageDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16">
          <div className="container px-4 mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h2 className="text-xl font-semibold text-red-700">Package Not Found</h2>
              <p className="mt-2 text-red-600">We couldn't find the package you're looking for.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <OrderSummary 
            packageName={packageDetails.title} 
            packagePrice={packageDetails.price}
            selectedAddOns={checkout.addOns.selectedItems}
            appliedDiscount={checkout.discounts.bundle.info}
            tieredDiscount={checkout.discounts.tiered.info}
            isFirstPurchase={checkout.discounts.tiered.isFirstPurchase}
            bundleDiscountAmount={checkout.discounts.bundle.amount}
            tieredDiscountAmount={checkout.discounts.tiered.amount}
            loyaltyBonusAmount={checkout.discounts.loyalty.amount}
            totalDiscountAmount={checkout.discounts.total}
            invoiceNumber={checkout.invoiceNumber}
            isLoyaltyProgramEnabled={checkout.discounts.loyalty.enabled}
            limitedTimeOffer={checkout.discounts.offers.available ?? undefined}
            offerDiscountAmount={checkout.discounts.offers.amount}
            appliedCoupon={checkout.discounts.coupons.applied ?? undefined}
            couponDiscountAmount={checkout.discounts.coupons.amount}
            appliedMilestoneReward={checkout.discounts.rewards.applied}
            milestoneRewardAmount={checkout.discounts.rewards.amount}
          />
          
          {checkout.showDownloadOptions && checkout.orderId ? (
            <CheckoutSuccess 
              orderId={checkout.orderId}
              packageName={packageDetails.title}
              invoiceNumber={checkout.invoiceNumber}
              isGeneratingInvoice={checkout.isGeneratingInvoice}
              userId={userId}
            />
          ) : (
            <CheckoutForm 
              checkout={checkout}
              onOrderSuccess={(orderId) => checkout.handleOrderSuccess(orderId)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
