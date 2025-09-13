import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accountId } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Set the auth header for this request
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: ''
    });

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('marketplace_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('status', 'active')
      .single();

    if (accountError || !account) {
      return new Response('Account not found', { status: 404, headers: corsHeaders });
    }

    // Check user's wallet balance
    const { data: wallet, error: walletError } = await supabaseClient
      .from('user_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet || wallet.balance < account.price) {
      return new Response('Insufficient balance', { status: 400, headers: corsHeaders });
    }

    // Start transaction
    const serviceRoleClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Deduct from wallet
    const { error: deductError } = await serviceRoleClient.rpc('decrement_balance', {
      uid: user.id,
      val: account.price
    });

    if (deductError) {
      return new Response('Payment failed', { status: 500, headers: corsHeaders });
    }

    // Mark account as sold
    const { error: updateError } = await serviceRoleClient
      .from('marketplace_accounts')
      .update({ status: 'sold' })
      .eq('id', accountId);

    if (updateError) {
      console.error('Error updating account status:', updateError);
    }

    // Create transaction record
    const { error: transactionError } = await serviceRoleClient
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'purchase',
        amount: account.price,
        status: 'completed',
        description: `Purchased ${account.platform} account - @${account.username}`,
        metadata: {
          account_id: accountId,
          account_platform: account.platform,
          account_username: account.username
        }
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
    }

    // Deliver credentials via message
    const credentialsMessage = `🎉 Purchase Successful!

Account Details:
Platform: ${account.platform}
Username: @${account.username}
Followers: ${account.followers.toLocaleString()}

Login Credentials:
${account.credentials ? JSON.stringify(account.credentials, null, 2) : 'Credentials will be provided by support team'}

Important Notes:
- Change password immediately after login
- Enable 2FA for security
- Contact support if you encounter any issues

Support: @Ultrabase1, @Ultrabase2, @Ultrabase3, @Ultrabase4`;

    const { error: messageError } = await serviceRoleClient
      .from('messages')
      .insert({
        user_id: user.id,
        title: `${account.platform} Account Purchased - @${account.username}`,
        content: credentialsMessage,
        type: 'credential'
      });

    if (messageError) {
      console.error('Error creating message:', messageError);
    }

    // Send Telegram notification (simplified - you'd integrate with your bot)
    try {
      const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      if (telegramToken) {
        const telegramMessage = `New purchase completed!\nUser: ${user.email}\nAccount: ${account.platform} @${account.username}\nPrice: ${account.price} UC`;
        
        // Note: You'll need to configure your bot and chat ID
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: Deno.env.get('TELEGRAM_CHAT_ID') || '-1001234567890', // Replace with your chat ID
            text: telegramMessage
          })
        });
      }
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account purchased successfully! Check your messages for credentials.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Purchase error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});