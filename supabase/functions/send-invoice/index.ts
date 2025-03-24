
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
    const { 
      invoiceId,
      email,
      name,
      orderId,
      items,
      amount,
      invoiceNumber,
      dueDate
    } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate the invoice email HTML
    const invoiceHtml = generateInvoiceHtml({
      name,
      invoiceNumber,
      items,
      amount,
      dueDate: new Date(dueDate).toLocaleDateString(),
      issueDate: new Date().toLocaleDateString()
    });
    
    // In a real implementation, you would send the email here
    // For now, we'll just log that we would send it
    console.log(`Sending invoice #${invoiceNumber} to ${email}`);

    // For demo purposes, we're simulating sending the email
    const emailSent = true;
    
    if (emailSent) {
      // Update the invoice record to mark it as sent
      const { data, error } = await supabase
        .from('invoices')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', invoiceId);
      
      if (error) {
        throw new Error(`Failed to update invoice status: ${error.message}`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Invoice #${invoiceNumber} sent to ${email}` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to generate invoice HTML
function generateInvoiceHtml({ name, invoiceNumber, items, amount, dueDate, issueDate }) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .invoice { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
          .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
          .details { margin-bottom: 20px; }
          .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items th, .items td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; }
          .totals { margin-left: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .grand-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>INVOICE</h1>
            <h2>#${invoiceNumber}</h2>
          </div>
          
          <div class="details">
            <p><strong>To:</strong> ${name}</p>
            <p><strong>Issue Date:</strong> ${issueDate}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <table class="items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>$${amount.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <p>Thank you for your business!</p>
            <p>Payment is due by ${dueDate}. Please make payment to the account details provided separately.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
