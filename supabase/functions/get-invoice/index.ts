
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
    const { invoice_id, user_id } = await req.json();
    
    if (!invoice_id) {
      throw new Error('Invoice ID is required');
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query to get the invoice
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoice_id);
    
    // If user_id is provided, add it to the query
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    // Execute the query
    const { data: invoice, error } = await query.single();
    
    if (error) {
      throw new Error(`Failed to fetch invoice: ${error.message}`);
    }
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Get the invoice HTML content
    let invoiceHtml = invoice.html_content;
    
    // If the invoice HTML is not stored in the database, generate it
    if (!invoiceHtml) {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', invoice.order_id)
        .single();
      
      if (orderError || !order) {
        throw new Error(`Failed to fetch order: ${orderError?.message || 'Order not found'}`);
      }
      
      // Get customer details
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', order.customer_id)
        .single();
      
      if (customerError || !customer) {
        throw new Error(`Failed to fetch customer: ${customerError?.message || 'Customer not found'}`);
      }
      
      // Generate invoice HTML
      invoiceHtml = generateInvoiceHtml({
        invoiceNumber: invoice.invoice_number,
        customerName: `${customer.first_name} ${customer.last_name}`,
        customerEmail: customer.email,
        orderItems: JSON.parse(order.items || '[]'),
        amount: order.total_amount,
        date: new Date(invoice.created_at).toLocaleDateString(),
        dueDate: new Date(invoice.due_date).toLocaleDateString()
      });
      
      // Update the invoice with the generated HTML
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ html_content: invoiceHtml })
        .eq('id', invoice.id);
      
      if (updateError) {
        console.error('Failed to update invoice HTML:', updateError);
      }
    }
    
    // Prepare PDF URL if available
    const pdfUrl = invoice.pdf_url || null;
    
    return new Response(
      JSON.stringify({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        html: invoiceHtml,
        pdf_url: pdfUrl,
        created_at: invoice.created_at,
        status: invoice.status
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to generate invoice HTML
function generateInvoiceHtml({ 
  invoiceNumber, 
  customerName, 
  customerEmail, 
  orderItems, 
  amount, 
  date, 
  dueDate 
}) {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 0;
            margin: 0;
            font-size: 14px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .company-details {
            text-align: right;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2a2a2a;
          }
          .invoice-number {
            font-size: 16px;
            color: #555;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-dates {
            display: flex;
            gap: 40px;
          }
          .date-group {
            margin-bottom: 15px;
          }
          .date-label {
            font-weight: 600;
            margin-bottom: 5px;
            color: #555;
          }
          .date-value {
            color: #2a2a2a;
          }
          .customer-details {
            margin-bottom: 30px;
          }
          .customer-name {
            font-weight: 600;
            margin-bottom: 5px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .invoice-table th {
            background-color: #f8f9fa;
            text-align: left;
            padding: 10px;
            font-weight: 600;
            color: #555;
            border-bottom: 2px solid #eee;
          }
          .invoice-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
          }
          .item-description {
            max-width: 300px;
          }
          .text-right {
            text-align: right;
          }
          .invoice-totals {
            width: 300px;
            margin-left: auto;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .total-label {
            color: #555;
          }
          .grand-total {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #eee;
            padding-top: 10px;
            margin-top: 10px;
          }
          .invoice-footer {
            margin-top: 40px;
            text-align: center;
            color: #777;
            font-size: 13px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          @media (max-width: 768px) {
            .invoice-header,
            .invoice-details {
              flex-direction: column;
            }
            .company-details {
              text-align: left;
              margin-top: 20px;
            }
            .invoice-dates {
              flex-direction: column;
              gap: 15px;
            }
            .invoice-totals {
              width: 100%;
            }
            .invoice-table th:nth-child(3),
            .invoice-table td:nth-child(3) {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${invoiceNumber}</div>
            </div>
            <div class="company-details">
              <div>Lovable</div>
              <div>1234 Innovation Drive</div>
              <div>San Francisco, CA 94107</div>
              <div>support@lovable.dev</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="customer-details">
              <div class="date-label">Billed To:</div>
              <div class="customer-name">${customerName}</div>
              <div>${customerEmail}</div>
            </div>
            
            <div class="invoice-dates">
              <div class="date-group">
                <div class="date-label">Issue Date</div>
                <div class="date-value">${date}</div>
              </div>
              
              <div class="date-group">
                <div class="date-label">Due Date</div>
                <div class="date-value">${dueDate}</div>
              </div>
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr>
                  <td class="item-description">${item.description || item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${parseFloat(item.price).toFixed(2)}</td>
                  <td class="text-right">$${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="invoice-totals">
            <div class="total-row">
              <span class="total-label">Subtotal</span>
              <span>$${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span class="total-label">Total</span>
              <span>$${parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="invoice-footer">
            <p>Thank you for your business!</p>
            <p>Payment is due by ${dueDate}.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
