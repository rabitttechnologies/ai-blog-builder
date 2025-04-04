
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

serve(async (req: Request) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature found", { status: 400 });
    }

    const body = await req.text();
    
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const planId = subscription.items.data[0].price.metadata.planId || "basic";
    const period = subscription.items.data[0].price.recurring?.interval === "month" 
      ? "monthly" 
      : "yearly";

    // Get the user from the Stripe customer ID
    const { data: profiles, error } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error || !profiles.length) {
      throw new Error("No user found with the given Stripe customer ID");
    }

    const userId = profiles[0].id;

    // Update the user's subscription status
    await supabaseClient
      .from("subscriptions")
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status,
        plan_id: planId,
        period,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .select();

  } catch (error) {
    console.error("Error handling subscription change:", error);
    throw error;
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    await supabaseClient
      .from("subscriptions")
      .update({
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq("stripe_subscription_id", subscription.id);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
    throw error;
  }
}
