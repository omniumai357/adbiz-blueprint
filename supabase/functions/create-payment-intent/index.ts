
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@12.1.1?target=deno";

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
    const { amount, currency = 'usd' } = await req.json();
    
    if (!amount) {
      return new Response(
        JSON.stringify({ error: 'Amount is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Return the client secret
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
