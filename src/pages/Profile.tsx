import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Star,
  Settings,
  Bell,
  Lock,
  CreditCard,
  Activity
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });
  const [userStats, setUserStats] = useState({
    accountsBought: 0,
    accountsSold: 0,
    totalSpent: 0,
    totalEarned: 0,
    rating: 0,
    reviewCount: 0,
    joinDate: ""
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      // Get user transactions for stats
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate stats from transactions
      const purchases = transactions?.filter(t => t.type === 'purchase') || [];
      const sales = transactions?.filter(t => t.type === 'sale') || [];
      const deposits = transactions?.filter(t => t.type === 'deposit') || [];

      const totalSpent = purchases.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalEarned = sales.reduce((sum, t) => sum + t.amount, 0);

      setUserStats({
        accountsBought: purchases.length,
        accountsSold: sales.length,
        totalSpent,
        totalEarned,
        rating: 4.8, // Default rating
        reviewCount: 0, // TODO: Implement reviews
        joinDate: new Date(user.created_at || '').toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: profileData.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            My <span className="bg-gradient-primary bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and trading profile
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 glass-card">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{userStats.rating}</span>
                  <span className="text-muted-foreground">
                    ({userStats.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  Verified Trader
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.accountsBought}</div>
                    <div className="text-sm text-muted-foreground">Purchased</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{userStats.accountsSold}</div>
                    <div className="text-sm text-muted-foreground">Sold</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-semibold">{userStats.totalSpent.toLocaleString()} UC</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Earned</span>
                    <span className="font-semibold text-success">{userStats.totalEarned.toLocaleString()} UC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">{userStats.joinDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="p-6 glass-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <Button
                      variant={isEditing ? "success" : "outline"}
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated disabled:opacity-60 disabled:cursor-not-allowed"
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Security Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-success" />
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Button variant="hero">Enable 2FA</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-warning" />
                        <div>
                          <h4 className="font-medium">Payment Methods</h4>
                          <p className="text-sm text-muted-foreground">Manage your payment methods</p>
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-primary" />
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Transaction Updates", description: "Get notified about UC transactions" },
                      { title: "Account Listings", description: "New accounts matching your interests" },
                      { title: "Price Alerts", description: "When accounts in your watchlist change price" },
                      { title: "Security Alerts", description: "Login attempts and security changes" },
                      { title: "Marketing Updates", description: "Product updates and promotional offers" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { action: "Purchased Instagram account @lifestyle_blogger", time: "2 hours ago", type: "purchase" },
                      { action: "Deposited 1,000 UC via Paystack", time: "1 day ago", type: "deposit" },
                      { action: "Updated profile information", time: "3 days ago", type: "profile" },
                      { action: "Sold Twitter account @tech_insider", time: "1 week ago", type: "sale" },
                      { action: "Enabled email notifications", time: "2 weeks ago", type: "settings" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-surface-elevated/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'purchase' ? 'bg-destructive' :
                          activity.type === 'deposit' ? 'bg-success' :
                          activity.type === 'sale' ? 'bg-success' :
                          'bg-primary'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;