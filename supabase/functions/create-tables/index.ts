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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create tables with the specified schema
    const createTablesSQL = `
      -- USERS with roles
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- MARKETPLACE ACCOUNTS
      CREATE TABLE IF NOT EXISTS marketplace_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        platform TEXT NOT NULL,
        username TEXT NOT NULL,
        followers INTEGER DEFAULT 0,
        engagement_rate DECIMAL DEFAULT 0,
        price INTEGER NOT NULL, -- UC price
        description TEXT,
        images JSONB DEFAULT '[]',
        credentials JSONB, -- Store encrypted credentials
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending')),
        category TEXT,
        created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- USER WALLETS
      CREATE TABLE IF NOT EXISTS user_wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        balance INTEGER DEFAULT 0, -- UC balance
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      );

      -- TRANSACTIONS
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('deposit', 'purchase', 'transfer', 'sale')),
        amount INTEGER NOT NULL, -- UC or Naira amount
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        description TEXT,
        reference TEXT, -- Paystack reference or transaction reference
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- MESSAGES for credential delivery
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'credential' CHECK (type IN ('credential', 'notification', 'system')),
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_marketplace_accounts_status ON marketplace_accounts(status);
      CREATE INDEX IF NOT EXISTS idx_marketplace_accounts_created_by ON marketplace_accounts(created_by);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

      -- Create RLS policies
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE marketplace_accounts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

      -- Users policies
      CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON users
        FOR SELECT USING (auth.uid() = id);
      
      CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON users
        FOR UPDATE USING (auth.uid() = id);

      -- Marketplace policies
      CREATE POLICY IF NOT EXISTS "Anyone can view active marketplace accounts" ON marketplace_accounts
        FOR SELECT USING (status = 'active');
      
      CREATE POLICY IF NOT EXISTS "Users can view their own accounts" ON marketplace_accounts
        FOR SELECT USING (auth.uid() = created_by);
      
      CREATE POLICY IF NOT EXISTS "Admins can do everything on marketplace" ON marketplace_accounts
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      -- Wallet policies
      CREATE POLICY IF NOT EXISTS "Users can view their own wallet" ON user_wallets
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can update their own wallet" ON user_wallets
        FOR UPDATE USING (auth.uid() = user_id);

      -- Transaction policies
      CREATE POLICY IF NOT EXISTS "Users can view their own transactions" ON transactions
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can insert their own transactions" ON transactions
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      -- Messages policies
      CREATE POLICY IF NOT EXISTS "Users can view their own messages" ON messages
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can update their own messages" ON messages
        FOR UPDATE USING (auth.uid() = user_id);

      -- Create functions
      CREATE OR REPLACE FUNCTION increment_balance(uid UUID, val INTEGER)
      RETURNS VOID AS $$
      BEGIN
        INSERT INTO user_wallets (user_id, balance)
        VALUES (uid, val)
        ON CONFLICT (user_id)
        DO UPDATE SET 
          balance = user_wallets.balance + val,
          updated_at = NOW();
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE OR REPLACE FUNCTION decrement_balance(uid UUID, val INTEGER)
      RETURNS BOOLEAN AS $$
      DECLARE
        current_balance INTEGER;
      BEGIN
        SELECT balance INTO current_balance 
        FROM user_wallets 
        WHERE user_id = uid;
        
        IF current_balance IS NULL OR current_balance < val THEN
          RETURN FALSE;
        END IF;
        
        UPDATE user_wallets 
        SET balance = balance - val, updated_at = NOW()
        WHERE user_id = uid;
        
        RETURN TRUE;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Trigger to create user profile and wallet on signup
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO users (id, email, role)
        VALUES (NEW.id, NEW.email, 'user');
        
        INSERT INTO user_wallets (user_id, balance)
        VALUES (NEW.id, 0);
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    `;

    const { error } = await supabaseClient.rpc('exec_sql', { sql_query: createTablesSQL });

    if (error) {
      console.error('Error creating tables:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Set admin role for specified email
    const { error: adminError } = await supabaseClient
      .from('users')
      .upsert({ 
        id: 'admin-placeholder', // This will be replaced by actual user ID
        email: 'oneshotsxtg@gmail.com', 
        role: 'admin' 
      }, { onConflict: 'email' });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database schema created successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});