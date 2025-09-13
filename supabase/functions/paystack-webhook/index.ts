import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
    const signature = req.headers.get('x-paystack-signature');
    
    if (!signature || !paystackSecret) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const body = await req.text();
    
    // Verify webhook signature
    const hash = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(paystackSecret + body)
    );
    const expectedSignature = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { data } = event;
      const amountNaira = data.amount / 100; // Convert from kobo to naira
      const ucAmount = Math.floor(amountNaira * 0.1 * 100); // ₦100 = 10 UC
      const userId = data.metadata?.user_id;

      if (!userId) {
        console.error('No user_id in metadata');
        return new Response('No user_id', { status: 400, headers: corsHeaders });
      }

      // Credit user's wallet
      const { error: walletError } = await supabaseClient.rpc('increment_balance', {
        uid: userId,
        val: ucAmount
      });

      if (walletError) {
        console.error('Error crediting wallet:', walletError);
        return new Response('Wallet error', { status: 500, headers: corsHeaders });
      }

      // Create transaction record
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          amount: ucAmount,
          status: 'completed',
          description: `Paystack deposit - ₦${amountNaira}`,
          reference: data.reference,
          metadata: {
            paystack_data: data,
            naira_amount: amountNaira,
            uc_amount: ucAmount
          }
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
      }

      // Send success message to user
      const { error: messageError } = await supabaseClient
        .from('messages')
        .insert({
          user_id: userId,
          title: 'Deposit Successful',
          content: `Your deposit of ₦${amountNaira} has been processed successfully. ${ucAmount} UC has been added to your wallet.`,
          type: 'notification'
        });

      if (messageError) {
        console.error('Error creating message:', messageError);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Event not handled' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});