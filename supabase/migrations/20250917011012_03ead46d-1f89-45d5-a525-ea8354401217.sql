-- Add credentials table for account credentials
CREATE TABLE public.account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.marketplace_accounts(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  field_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on credentials table
ALTER TABLE public.account_credentials ENABLE ROW LEVEL SECURITY;

-- Only account owners and admins can view/manage credentials
CREATE POLICY "Account owners and admins can manage credentials"
ON public.account_credentials
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_accounts ma
    JOIN public.users u ON u.id = auth.uid()
    WHERE ma.id = account_credentials.account_id
    AND (ma.created_by = auth.uid() OR u.role = 'admin')
  )
);

-- Add metadata columns to transactions for better tracking
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add trigger for account_credentials updated_at
CREATE TRIGGER update_account_credentials_updated_at
BEFORE UPDATE ON public.account_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_account_credentials_account_id ON public.account_credentials(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_status ON public.transactions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);

-- Function to get real-time stats for admin dashboard
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_accounts', (SELECT COUNT(*) FROM marketplace_accounts),
    'active_accounts', (SELECT COUNT(*) FROM marketplace_accounts WHERE status = 'active'),
    'sold_accounts', (SELECT COUNT(*) FROM marketplace_accounts WHERE status = 'sold'),
    'pending_accounts', (SELECT COUNT(*) FROM marketplace_accounts WHERE status = 'pending'),
    'total_users', (SELECT COUNT(*) FROM users),
    'total_transactions', (SELECT COUNT(*) FROM transactions),
    'pending_transactions', (SELECT COUNT(*) FROM transactions WHERE status = 'pending'),
    'completed_transactions', (SELECT COUNT(*) FROM transactions WHERE status = 'completed'),
    'failed_transactions', (SELECT COUNT(*) FROM transactions WHERE status = 'failed'),
    'today_revenue', (
      SELECT COALESCE(SUM(amount), 0) 
      FROM transactions 
      WHERE status = 'completed' 
      AND DATE(created_at) = CURRENT_DATE
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(amount), 0) 
      FROM transactions 
      WHERE status = 'completed'
    ),
    'avg_account_price', (
      SELECT COALESCE(AVG(price), 0) 
      FROM marketplace_accounts 
      WHERE status = 'active'
    )
  ) INTO result;
  
  RETURN result;
END;
$$;