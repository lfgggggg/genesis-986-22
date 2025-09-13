import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WalletData {
  balance: number;
  loading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData>({
    balance: 0,
    loading: true,
    error: null
  });

  const fetchWallet = async () => {
    if (!user) {
      setWallet({ balance: 0, loading: false, error: 'Not authenticated' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        setWallet({ balance: 0, loading: false, error: error.message });
        return;
      }

      setWallet({ 
        balance: data?.balance || 0, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      console.error('Wallet fetch error:', error);
      setWallet({ 
        balance: 0, 
        loading: false, 
        error: 'Failed to fetch wallet' 
      });
    }
  };

  const initializePayment = async (amount: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to make a deposit",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: { amount }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive"
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchWallet();

    // Subscribe to wallet changes
    const subscription = supabase
      .channel('wallet_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_wallets',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          fetchWallet();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    ...wallet,
    refetch: fetchWallet,
    initializePayment
  };
};