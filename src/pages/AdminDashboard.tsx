import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminChart } from '@/components/admin/AdminChart';
import { AdminAccountsList } from '@/components/admin/AdminAccountsList';
import { supabase, MarketplaceAccount } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Plus, TrendingUp, Users, DollarSign, ShoppingCart, Activity, Crown, Settings, Zap, Eye, Filter, Download, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<MarketplaceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    conversionRate: 0,
  });
  const [newAccount, setNewAccount] = useState({
    platform: '',
    username: '',
    followers: 0,
    engagement_rate: 0,
    price: 0,
    description: '',
    category: '',
    images: [] as string[],
  });

  useEffect(() => {
    fetchAccounts();
    fetchRealTimeStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchRealTimeStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAccounts = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch marketplace accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      // Simulate real-time stats (in production, these would come from actual queries)
      setRealTimeStats({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        todayRevenue: Math.floor(Math.random() * 5000) + 1000,
        pendingOrders: Math.floor(Math.random() * 15) + 3,
        conversionRate: parseFloat((Math.random() * 10 + 85).toFixed(1)),
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };

  const handleAddAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('marketplace_accounts')
        .insert([{
          ...newAccount,
          status: 'active',
          created_by: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account added successfully!",
      });

      setIsAddDialogOpen(false);
      setNewAccount({
        platform: '',
        username: '',
        followers: 0,
        engagement_rate: 0,
        price: 0,
        description: '',
        category: '',
        images: [],
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: "Error",
        description: "Failed to add account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account deleted successfully!",
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccountStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_accounts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account status updated successfully!",
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ULTRASOLX Control Center
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Advanced marketplace management & real-time analytics dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRealTimeStats}
              disabled={refreshing}
              className="shadow-premium"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary shadow-premium text-lg px-6 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Premium Account
                </Button>
              </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select onValueChange={(value) => setNewAccount(prev => ({ ...prev, platform: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newAccount.username}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="followers">Followers</Label>
                    <Input
                      id="followers"
                      type="number"
                      value={newAccount.followers}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement Rate (%)</Label>
                    <Input
                      id="engagement"
                      type="number"
                      step="0.1"
                      value={newAccount.engagement_rate}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, engagement_rate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (UC)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newAccount.price}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newAccount.category}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Fashion, Tech, Gaming"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAccount.description}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Account description..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddAccount} className="w-full gradient-primary">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card hover:shadow-premium transition-all duration-300 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Users</CardTitle>
              <Activity className="h-4 w-4 text-success animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{realTimeStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Online now</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover:shadow-premium transition-all duration-300 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{realTimeStats.todayRevenue.toLocaleString()} UC</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover:shadow-premium transition-all duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{realTimeStats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover:shadow-premium transition-all duration-300 border-secondary-brand/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-brand">{realTimeStats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">+2.1% this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Statistics */}
        <AdminStats accounts={accounts} />

        {/* Advanced Management Interface */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Advanced Analytics</h3>
                <Button variant="outline" className="shadow-premium">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              <AdminChart accounts={accounts} />
            </div>
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Account Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <AdminAccountsList
              accounts={accounts}
              onDelete={handleDeleteAccount}
              onUpdateStatus={handleUpdateAccountStatus}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">System Monitoring</h3>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <Zap className="w-3 h-3 mr-1" />
                  All Systems Operational
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-card border-success/20">
                  <CardHeader>
                    <CardTitle className="text-success">Server Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>API Response</span>
                        <span className="text-success">98ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database</span>
                        <span className="text-success">45ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="text-success">99.9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-warning/20">
                  <CardHeader>
                    <CardTitle className="text-warning">Traffic Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Page Views</span>
                        <span className="text-warning">12.4K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unique Visitors</span>
                        <span className="text-warning">3.2K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bounce Rate</span>
                        <span className="text-warning">24%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Failed Logins</span>
                        <span className="text-primary">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blocked IPs</span>
                        <span className="text-primary">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SSL Status</span>
                        <span className="text-success">Valid</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <h3 className="text-2xl font-bold">System Settings</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Marketplace Configuration</CardTitle>
                    <CardDescription>Configure marketplace settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commission">Commission Rate (%)</Label>
                        <Input id="commission" defaultValue="10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price (UC)</Label>
                        <Input id="minPrice" defaultValue="50" />
                      </div>
                    </div>
                    <Button className="gradient-primary">Update Settings</Button>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage security configurations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                      <Input id="maxAttempts" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input id="sessionTimeout" defaultValue="30" />
                    </div>
                    <Button className="gradient-primary">Update Security</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}