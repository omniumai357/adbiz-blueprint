
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      phoneNumber,
      message,
      invoiceId,
      invoiceNumber
    } = await req.json();

    // Check if phone number is provided
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Twilio credentials from environment variables
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error('Twilio credentials are not configured');
    }

    // Prepare the message content if not provided
    const messageContent = message || 
      `Your invoice #${invoiceNumber} is ready. Please check your email for details or log in to your account to view it.`;
    
    console.log(`Sending SMS to ${phoneNumber}: ${messageContent}`);

    // Make request to Twilio API
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: twilioNumber,
          Body: messageContent
        }).toString()
      }
    );

    const twilioData = await twilioResponse.json();
    
    if (!twilioResponse.ok) {
      console.error('Twilio API error:', twilioData);
      throw new Error(`Failed to send SMS: ${twilioData.message}`);
    }

    console.log('SMS sent successfully:', twilioData.sid);
    
    // Update the invoice record to mark SMS as sent if invoiceId is provided
    if (invoiceId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase
        .from('invoices')
        .update({ 
          sms_sent_at: new Date().toISOString(),
          delivery_status: 'sms_sent'
        })
        .eq('id', invoiceId);
      
      if (error) {
        console.error('Error updating invoice SMS status:', error);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: twilioData.sid,
        message: `SMS sent to ${phoneNumber}` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending SMS:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to create Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
