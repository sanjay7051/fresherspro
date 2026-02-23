import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, mock } =
      await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- Mock mode for UI testing (no Razorpay keys needed) ---
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const isMockAllowed = !razorpayKeyId || !razorpaySecret;

    if (mock && isMockAllowed) {
      // Only allow mock when Razorpay is NOT configured (dev/test)
      const { data, error } = await supabaseAdmin
        .from("payments")
        .insert({
          razorpay_payment_id: `mock_${crypto.randomUUID()}`,
          amount: 4900,
          currency: "INR",
          status: "verified",
        })
        .select("download_token")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to record payment" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ download_token: data.download_token }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Real Razorpay verification ---
    if (!razorpaySecret || !razorpayKeyId) {
      return new Response(
        JSON.stringify({ error: "Razorpay is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing payment details" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify Razorpay signature using Web Crypto API
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpaySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureData = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, signatureData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify payment status with Razorpay API
    const credentials = btoa(`${razorpayKeyId}:${razorpaySecret}`);
    const paymentRes = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );

    if (!paymentRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to verify payment with Razorpay" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paymentDetails = await paymentRes.json();
    if (paymentDetails.status !== "captured") {
      return new Response(
        JSON.stringify({ error: "Payment not captured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate payment
    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("download_token")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ download_token: existing.download_token }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert verified payment
    const { data, error } = await supabaseAdmin
      .from("payments")
      .insert({
        razorpay_payment_id,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: "verified",
      })
      .select("download_token")
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to record payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ download_token: data.download_token }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
