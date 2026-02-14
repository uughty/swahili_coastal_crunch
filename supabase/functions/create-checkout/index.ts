import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@18.5.0?target=deno&no-check"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ✅ FIXED: Handle double JSON parsing
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { items, customer_email, customer_name, paymentMethod } = body;
    console.log('📥 Parsed:', { items: items?.length, customer_email, paymentMethod });

    if (!items || !items.length) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey || !stripeSecretKey) {
      console.error('❌ Missing env vars');
      return new Response(JSON.stringify({ error: 'Missing env vars' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    // CASH PAYMENT
    if (paymentMethod === 'cash') {
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
      const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      const { error } = await supabase.from('orders').insert({ 
        id: orderId,
        customer_email,
        customer_name,
        items,
        total,
        payment_method: 'cash',
        status: 'pending'
      });
      
      if (error) {
        console.error('💸 Cash error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify({ cash: true, orderId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // STRIPE CHECKOUT
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { 
          name: item.name,
          ...(item.options && { description: item.options })
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const paymentMethodTypes = ['card'];
    if (paymentMethod === 'paypal') paymentMethodTypes.push('paypal');
    if (paymentMethod === 'cashapp') paymentMethodTypes.push('cashapp');

    const session = await stripe.checkout.sessions.create({
      customer_email,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: paymentMethodTypes,
      success_url: `http://localhost:3000/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/checkout?canceled=true`,
      metadata: {
        customer_name,
        paymentMethod,
      },
    });

    // Save pending order
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    const { error } = await supabase.from('orders').insert({ 
      id: orderId,
      customer_email,
      customer_name,
      stripe_session_id: session.id,
      items,
      total: session.amount_total! / 100,
      payment_method: paymentMethod,
      status: 'pending'
    });

    if (error) {
      console.error('💳 Stripe save error:', error);
      // Still return Stripe URL even if DB fails
    }

    console.log('✅ Success:', { orderId, sessionId: session.id });

    return new Response(JSON.stringify({ 
      url: session.url,
      orderId,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('💥 FULL ERROR:', error.message);
    console.error('Stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
})
