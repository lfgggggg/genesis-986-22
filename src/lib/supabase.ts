import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooabimdnvzplczqgklcs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYWJpbWRudnpwbGN6cWdrbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDk3MDIsImV4cCI6MjA3MzIyNTcwMn0.MrN0r8JPTU4D8JxEytnnmVJoCiZGc_isZpO-mDZZJsU';

export { supabaseUrl, supabaseAnonKey };

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface MarketplaceAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  engagement_rate: number;
  price: number;
  description: string;
  category: string;
  status: 'active' | 'sold' | 'pending';
  images: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'purchase' | 'transfer';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}