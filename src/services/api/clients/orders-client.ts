
import { supabaseClient } from "../supabase-client";
import { Order, CustomerInfo, CompanyInfo } from "@/types/api";
import { Json } from "@/integrations/supabase/types";

/**
 * Orders API Client
 */
export const ordersClient = {
  /**
   * Get orders for a user
   */
  getUserOrders: async (userId: string): Promise<Order[]> => {
    if (!userId) return [];
    
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match the Order type
    return (data || []).map((order: any) => ({
      id: order.id,
      user_id: order.user_id,
      package_id: order.package_id,
      total_amount: order.total_amount,
      contact_info: order.contact_info as unknown as CustomerInfo | null,
      company_info: order.company_info as unknown as CompanyInfo | null,
      payment_method: order.payment_method,
      payment_id: order.payment_id,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at
    }));
  },
  
  /**
   * Create a new order
   */
  createOrder: async (orderData: {
    userId: string;
    packageId?: string;
    totalAmount: number;
    contactInfo: CustomerInfo;
    companyInfo?: CompanyInfo;
    paymentMethod: string;
    paymentId?: string;
  }): Promise<Order> => {
    const { data, error } = await supabaseClient
      .from('orders')
      .insert({
        user_id: orderData.userId,
        package_id: orderData.packageId,
        total_amount: orderData.totalAmount,
        contact_info: orderData.contactInfo as unknown as Json,
        company_info: orderData.companyInfo as unknown as Json,
        payment_method: orderData.paymentMethod,
        payment_id: orderData.paymentId,
        status: 'completed'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Transform the response to match the Order type
    return {
      id: data.id,
      user_id: data.user_id,
      package_id: data.package_id,
      total_amount: data.total_amount,
      contact_info: data.contact_info as unknown as CustomerInfo | null,
      company_info: data.company_info as unknown as CompanyInfo | null,
      payment_method: data.payment_method,
      payment_id: data.payment_id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
};
