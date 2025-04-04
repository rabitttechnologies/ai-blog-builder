
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  planId: string;
  period: string;
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    // Extract the JWT token
    const token = authHeader.replace("Bearer ", "");

    // Get the user from Supabase
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Parse the request
    const { planId, period } = await req.json() as CheckoutRequest;

    if (!planId || !period) {
      throw new Error("Missing required parameters");
    }

    // Check if the user already has a Stripe customer ID
    const { data: profiles, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profilesError && profilesError.code !== "PGRST116") {
      throw profilesError;
    }

    let customerId = profiles?.stripe_customer_id;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: user.id,
        },
      });

      customerId = customer.id;

      // Update the user profile with the Stripe customer ID
      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Create Stripe price lookup object
    const prices = {
      "basic-monthly": Deno.env.get("STRIPE_PRICE_BASIC_MONTHLY"),
      "basic-yearly": Deno.env.get("STRIPE_PRICE_BASIC_YEARLY"),
      "pro-monthly": Deno.env.get("STRIPE_PRICE_PRO_MONTHLY"),
      "pro-yearly": Deno.env.get("STRIPE_PRICE_PRO_YEARLY"),
      "enterprise-monthly": Deno.env.get("STRIPE_PRICE_ENTERPRISE_MONTHLY"),
      "enterprise-yearly": Deno.env.get("STRIPE_PRICE_ENTERPRISE_YEARLY"),
    };

    const priceKey = `${planId}-${period}` as keyof typeof prices;
    const priceId = prices[priceKey];

    if (!priceId) {
      throw new Error(`Price not found for plan: ${planId} with period: ${period}`);
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${new URL(req.url).origin}/subscription?success=true`,
      cancel_url: `${new URL(req.url).origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planId,
        period,
      },
    });

    // Return the session URL
    return new Response(
      JSON.stringify({
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
