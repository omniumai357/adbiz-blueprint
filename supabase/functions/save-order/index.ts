
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const orderDetails = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Add download information to order
    const orderWithDownload = {
      ...orderDetails,
      downloads: {
        available: true,
        formats: ["pdf", "png", "video", "audio"],
        downloadCount: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }
    };
    
    // Generate a unique order ID
    const orderId = 'order_' + Math.random().toString(36).substring(2, 15);
    
    // Create the complete order object
    const completeOrder = {
      id: orderId,
      ...orderWithDownload,
      createdAt: new Date().toISOString()
    };
    
    // Log the order details for debugging
    console.log('Saving order:', completeOrder);
    
    // Generate invoice number
    const generateInvoiceNumber = () => {
      const prefix = 'INV';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${prefix}-${timestamp}-${random}`;
    };
    
    // Insert invoice information if customerInfo is present
    if (orderDetails.customerInfo) {
      const { firstName, lastName, email } = orderDetails.customerInfo;
      const invoiceNumber = generateInvoiceNumber();
      
      // Set due date to 14 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      // Create invoice items from package
      const items = [{
        description: orderDetails.packageDetails?.title || "Product Purchase",
        quantity: 1,
        price: orderDetails.packageDetails?.price || orderDetails.amount
      }];
      
      console.log('Creating invoice:', {
        order_id: orderId,
        customer_email: email,
        customer_name: `${firstName} ${lastName}`,
        amount: orderDetails.packageDetails?.price || orderDetails.amount,
        invoice_number: invoiceNumber,
        items
      });
      
      try {
        // Insert the invoice in the database
        const { data: invoice, error } = await supabase
          .from('invoices')
          .insert({
            order_id: orderId,
            customer_email: email,
            customer_name: `${firstName} ${lastName}`,
            amount: orderDetails.packageDetails?.price || orderDetails.amount,
            invoice_number: invoiceNumber,
            due_date: dueDate.toISOString(),
            items: items
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating invoice:', error);
        } else {
          console.log('Invoice created successfully:', invoice);
          
          // Add invoice number to the order response
          completeOrder.invoice = {
            id: invoice.id,
            invoiceNumber: invoiceNumber
          };
        }
      } catch (err) {
        console.error('Error creating invoice:', err);
      }
    }
    
    return new Response(
      JSON.stringify(completeOrder),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saving order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
