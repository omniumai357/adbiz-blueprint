
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import { useProfile } from "@/hooks/data/useProfile";
import { supabase } from "@/integrations/supabase/client";

export function useOrderDetails() {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userId = searchParams.get("userId") || undefined;
  const packageId = searchParams.get("packageId") || "0";
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState(0);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  
  const { profile, isLoading: isProfileLoading } = useProfile(userId);

  // Fetch package details on initial load
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

  const handleOrderSuccess = async (orderId: string) => {
    setShowDownloadOptions(true);
    setOrderId(orderId);

    const newInvoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    setInvoiceNumber(newInvoiceNumber);

    toast({
      title: "Order Successful!",
      description: "Your order has been placed successfully.",
    });

    setIsGeneratingInvoice(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGeneratingInvoice(false);

    setTimeout(() => {
      navigate(`/download?orderId=${orderId}&invoiceNumber=${newInvoiceNumber}`);
    }, 5000);
  };

  return {
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    profile,
    handleOrderSuccess
  };
}
