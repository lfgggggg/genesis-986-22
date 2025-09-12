import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, MarketplaceAccount } from '@/lib/supabase';
import { Search, Filter, Users, TrendingUp, Instagram, Youtube, Twitter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [accounts, setAccounts] = useState<MarketplaceAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_accounts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on search and filter criteria
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || account.category.toLowerCase() === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || account.platform.toLowerCase() === selectedPlatform;
    
    let matchesPriceRange = true;
    if (priceRange === 'low') matchesPriceRange = account.price < 500;
    else if (priceRange === 'medium') matchesPriceRange = account.price >= 500 && account.price < 1500;
    else if (priceRange === 'high') matchesPriceRange = account.price >= 1500;

    return matchesSearch && matchesCategory && matchesPlatform && matchesPriceRange;
  });

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'twitter':
        return Twitter;
      default:
        return Users;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Social Media <span className="bg-gradient-primary bg-clip-text text-transparent">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and purchase verified social media accounts with UC
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 glass-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under 500 UC</SelectItem>
                <SelectItem value="medium">500 - 1500 UC</SelectItem>
                <SelectItem value="high">Over 1500 UC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredAccounts.length} accounts found`}
          </p>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => {
              const PlatformIcon = getPlatformIcon(account.platform);
              return (
                <Card key={account.id} className="glass-card hover:shadow-premium transition-spring group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <PlatformIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{account.username}</CardTitle>
                          <CardDescription className="capitalize">{account.platform}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-surface-elevated">
                        {account.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-2">{account.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{formatFollowers(account.followers)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="font-semibold">{account.engagement_rate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {account.price.toLocaleString()} UC
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ~${(account.price * 1.2).toFixed(0)} USD
                        </div>
                      </div>
                      <Button className="gradient-primary shadow-premium group-hover:shadow-glow">
                        Purchase Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredAccounts.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground mb-2">No accounts found</div>
                <div className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </div>
              </div>
            )}
          </div>
        )}

        {/* Load More - Only show if there are accounts */}
        {filteredAccounts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10">
              Load More Accounts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};