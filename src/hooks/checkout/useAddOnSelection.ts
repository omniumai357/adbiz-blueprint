
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AddOnItem } from "@/components/checkout/add-on-item";

export function useAddOnSelection() {
  const [availableAddOns, setAvailableAddOns] = useState<AddOnItem[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch available add-ons
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

  const selectedAddOns = availableAddOns.filter(addon => selectedAddOnIds.includes(addon.id));

  return {
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns
  };
}
