import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  Wallet as WalletIcon, 
  Plus, 
  Send, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Banknote,
  CreditCard
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
}

const Wallet = () => {
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const pendingBalance = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'purchase':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      case 'transfer':
        return <Send className="w-4 h-4 text-warning" />;
      case 'sale':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            My <span className="bg-gradient-primary bg-clip-text text-transparent">UC Wallet</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your Universal Currency for secure transactions
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <Card className="p-6 glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Available Balance</h3>
              <WalletIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{balance.toLocaleString()} UC</div>
              <div className="text-sm text-muted-foreground">
                ~${(balance * 1.2).toLocaleString()} USD
              </div>
            </div>
          </Card>

          {/* Pending Balance */}
          <Card className="p-6 glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Pending</h3>
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-warning">{pendingBalance.toLocaleString()} UC</div>
              <div className="text-sm text-muted-foreground">Processing transactions</div>
            </div>
          </Card>

          {/* Total Portfolio */}
          <Card className="p-6 glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Total Portfolio</h3>
              <Banknote className="w-5 h-5 text-success" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-success">
                {(balance + pendingBalance).toLocaleString()} UC
              </div>
              <div className="text-sm text-success flex items-center">
                +12.5% this month
              </div>
            </div>
          </Card>
        </div>

        {/* Wallet Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transactions & Actions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                <TabsTrigger value="transfer">Send UC</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                <Card className="glass-card">
                  <div className="p-6 border-b border-border/30">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  </div>
                  <div className="divide-y divide-border/30">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <div>
                            <p className={`font-bold ${
                              transaction.amount > 0 ? 'text-success' : 'text-foreground'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount} UC
                            </p>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm text-muted-foreground capitalize">
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t border-border/30">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="transfer">
                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold mb-6">Send UC to Another User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Username</label>
                      <Input
                        placeholder="@username"
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount (UC)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Available: {balance.toLocaleString()} UC
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button variant="hero" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send UC
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Deposit UC */}
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-primary" />
                Add UC
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (NGN)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    ≈ {depositAmount ? Math.floor(parseFloat(depositAmount) / 1.2) : 0} UC
                  </p>
                </div>
                <Button variant="success" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Deposit via Paystack
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposited</span>
                  <span className="font-semibold text-success">+1,200 UC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold">-850 UC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earned</span>
                  <span className="font-semibold text-success">+650 UC</span>
                </div>
                <div className="border-t border-border/30 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Net Change</span>
                    <span className="font-bold text-success">+1,000 UC</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;