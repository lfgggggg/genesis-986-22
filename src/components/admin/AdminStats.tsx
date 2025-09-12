import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketplaceAccount } from '@/lib/supabase';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';

interface AdminStatsProps {
  accounts: MarketplaceAccount[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({ accounts }) => {
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(acc => acc.status === 'active').length;
  const soldAccounts = accounts.filter(acc => acc.status === 'sold').length;
  const totalValue = accounts.reduce((sum, acc) => sum + acc.price, 0);
  const avgPrice = totalAccounts > 0 ? Math.round(totalValue / totalAccounts) : 0;
  const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);

  const stats = [
    {
      title: "Total Accounts",
      value: totalAccounts.toLocaleString(),
      description: `${activeAccounts} active, ${soldAccounts} sold`,
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Value",
      value: `${totalValue.toLocaleString()} UC`,
      description: `Avg: ${avgPrice} UC per account`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Followers",
      value: totalFollowers.toLocaleString(),
      description: `Across all accounts`,
      icon: Users,
      color: "text-secondary-brand",
      bgColor: "bg-secondary-brand/10",
    },
    {
      title: "Avg Engagement",
      value: `${accounts.length > 0 ? (accounts.reduce((sum, acc) => sum + acc.engagement_rate, 0) / accounts.length).toFixed(1) : 0}%`,
      description: "Average engagement rate",
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card hover:shadow-premium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};