
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, PaginatedReceipts, ReceiptSearchParams } from "@/components/receipts/types";

export const useReceipts = (
  userId: string | undefined, 
  page = 1, 
  pageSize = 5,
  searchParams: ReceiptSearchParams = {}
) => {
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  // Use React Query to fetch receipts
  const receiptsQuery = useQuery({
    queryKey: ['receipts', { userId, page, pageSize, ...searchParams }],
    queryFn: async () => {
      if (!userId) return { data: [], totalCount: 0 };
      
      try {
        // Function to apply filters to a query
        const applyFilters = (baseQuery: any) => {
          let filteredQuery = baseQuery.eq('user_id', userId).eq('status', 'completed');
          
          // Apply search filters
          if (searchParams.query) {
            // Search in invoice numbers and potential package titles
            filteredQuery = filteredQuery.or(`invoices.invoice_number.ilike.%${searchParams.query}%`);
          }
          
          if (searchParams.dateFrom) {
            filteredQuery = filteredQuery.gte('created_at', searchParams.dateFrom);
          }
          
          if (searchParams.dateTo) {
            // Add one day to include the end date
            const nextDay = new Date(searchParams.dateTo);
            nextDay.setDate(nextDay.getDate() + 1);
            filteredQuery = filteredQuery.lt('created_at', nextDay.toISOString());
          }
          
          if (searchParams.minAmount !== undefined) {
            filteredQuery = filteredQuery.gte('total_amount', searchParams.minAmount);
          }
          
          if (searchParams.maxAmount !== undefined) {
            filteredQuery = filteredQuery.lte('total_amount', searchParams.maxAmount);
          }
          
          return filteredQuery;
        };
        
        // Create a query for the count
        const countQuery = supabase
          .from('orders')
          .select('id', { count: 'exact' });
          
        // Apply the same filters to the count query
        const filteredCountQuery = applyFilters(countQuery);
        
        // Get total count with the same filters
        const { count: total, error: countError } = await filteredCountQuery;
          
        if (countError) throw countError;
        
        // Calculate range for pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        // Get orders with applied filters and pagination
        let dataQuery = supabase
          .from('orders')
          .select('id, created_at, total_amount, status, package_id, company_info, invoices(invoice_number)');
          
        // Apply the same filters to the data query
        dataQuery = applyFilters(dataQuery);
        
        const { data, error } = await dataQuery
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

        return { 
          data: formattedReceipts,
          totalCount: total || 0
        };
      } catch (error) {
        console.error("Error fetching receipts:", error);
        toast({
          title: "Failed to load receipts",
          description: "Please try again later",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!userId,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Failed to load receipts",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  });

  // Set pagination data when query results change
  useEffect(() => {
    if (receiptsQuery.data) {
      setTotalCount(receiptsQuery.data.totalCount);
      setTotalPages(Math.ceil(receiptsQuery.data.totalCount / pageSize));
    }
  }, [receiptsQuery.data, pageSize]);

  return { 
    receipts: receiptsQuery.data?.data || [], 
    loading: receiptsQuery.isLoading,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount
    }
  };
};
