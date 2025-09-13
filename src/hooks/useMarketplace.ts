import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MarketplaceAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  engagement_rate: number;
  price: number;
  description: string;
  images: string[];
  category: string;
  status: 'active' | 'sold' | 'pending';
  created_at: string;
  created_by: string;
}

export const useMarketplace = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<MarketplaceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_accounts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setAccounts(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching marketplace accounts:', error);
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const purchaseAccount = async (accountId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to purchase an account",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('purchase-account', {
        body: { accountId }
      });

      if (error) {
        toast({
          title: "Purchase Failed",
          description: error.message || "Failed to purchase account",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Purchase Successful",
        description: "Account purchased! Check your messages for credentials.",
      });

      // Refresh accounts list
      fetchAccounts();
      return true;
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Error",
        description: "Failed to purchase account",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAccounts();

    // Subscribe to marketplace changes
    const subscription = supabase
      .channel('marketplace_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'marketplace_accounts'
        }, 
        () => {
          fetchAccounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    purchaseAccount
  };
};