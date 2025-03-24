
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Receipt } from "@/components/receipts/types";

export const useReceipts = (userId: string | undefined) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!userId) {
        setReceipts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get orders with invoice info
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            total_amount, 
            status,
            package_id,
            company_info,
            invoices(invoice_number)
          `)
          .eq('user_id', userId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get package details
        const packageIds = data
          .map(order => order.package_id)
          .filter(Boolean);
          
        const { data: packagesData } = await supabase
          .from('packages')
          .select('id, title')
          .in('id', packageIds);
        
        const packageMap = packagesData?.reduce((acc: Record<string, string>, pkg: any) => {
          acc[pkg.id] = pkg.title;
          return acc;
        }, {});

        // Format receipt data
        const formattedReceipts = data.map((order: any) => ({
          id: order.id,
          created_at: order.created_at,
          total_amount: order.total_amount,
          invoice_number: order.invoices && order.invoices[0]?.invoice_number,
          package_title: order.package_id ? packageMap[order.package_id] : undefined
        }));

        setReceipts(formattedReceipts);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        toast({
          title: "Failed to load receipts",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [userId, toast]);

  return { receipts, loading };
};
