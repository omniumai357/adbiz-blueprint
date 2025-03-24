
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, PaginatedReceipts, ReceiptSearchParams } from "@/components/receipts/types";

export const useReceipts = (
  userId: string | undefined, 
  page = 1, 
  pageSize = 5,
  searchParams: ReceiptSearchParams = {}
) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
        
        // Start building the query
        let query = supabase
          .from('orders')
          .select('id, created_at, total_amount, status, package_id, company_info, invoices(invoice_number)')
          .eq('user_id', userId)
          .eq('status', 'completed');
          
        // Apply search filters
        if (searchParams.query) {
          // Search in invoice numbers and potential package titles
          query = query.or(`invoices.invoice_number.ilike.%${searchParams.query}%`);
        }
        
        if (searchParams.dateFrom) {
          query = query.gte('created_at', searchParams.dateFrom);
        }
        
        if (searchParams.dateTo) {
          // Add one day to include the end date
          const nextDay = new Date(searchParams.dateTo);
          nextDay.setDate(nextDay.getDate() + 1);
          query = query.lt('created_at', nextDay.toISOString());
        }
        
        if (searchParams.minAmount !== undefined) {
          query = query.gte('total_amount', searchParams.minAmount);
        }
        
        if (searchParams.maxAmount !== undefined) {
          query = query.lte('total_amount', searchParams.maxAmount);
        }
        
        // Get total count with the same filters
        // Using the correct way to get count with the latest Supabase client
        const countQuery = query.clone();
        const { count: total, error: countError } = await countQuery.count();
          
        if (countError) throw countError;
        
        // Set count and calculate total pages
        setTotalCount(total || 0);
        setTotalPages(Math.ceil((total || 0) / pageSize));
        
        // Calculate range for pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        // Get orders with applied filters and pagination
        const { data, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // Get package details
        const packageIds = data
          .map(order => order.package_id)
          .filter(Boolean);
          
        let packageMap: Record<string, string> = {};
        
        if (packageIds.length > 0) {
          const { data: packagesData } = await supabase
            .from('packages')
            .select('id, title')
            .in('id', packageIds);
          
          packageMap = packagesData?.reduce((acc: Record<string, string>, pkg: any) => {
            acc[pkg.id] = pkg.title;
            return acc;
          }, {}) || {};
        }

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
  }, [userId, page, pageSize, toast, searchParams]);

  const paginatedResults: PaginatedReceipts = {
    data: receipts,
    totalCount,
    page,
    pageSize,
    totalPages
  };

  return { 
    receipts: paginatedResults.data, 
    loading,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount
    }
  };
};
