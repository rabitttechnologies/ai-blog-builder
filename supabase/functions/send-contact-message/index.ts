
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  sessionId: string;
  userId: string | null;
  workflowId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const formData: ContactFormData = await req.json();
    const { name, email, subject, message, sessionId, userId, workflowId } = formData;

    // Validate the form data
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          workflowId,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store the message in Supabase
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          subject,
          message,
          session_id: sessionId,
          user_id: userId,
          workflow_id: workflowId,
          status: "new"
        },
      ])
      .select();

    if (error) {
      console.error("Error storing contact message:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to store message",
          details: error.message,
          workflowId,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real implementation, you would send an email here
    // For now, we'll just log it
    console.log(`Message received from ${name} (${email}): ${subject}`);
    console.log(`Session ID: ${sessionId}, User ID: ${userId}, Workflow ID: ${workflowId}`);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        message: "Message received successfully",
        workflowId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
