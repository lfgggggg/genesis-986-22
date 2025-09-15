import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketplaceAccount } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AdminChartProps {
  accounts: MarketplaceAccount[];
}

export const AdminChart: React.FC<AdminChartProps> = ({ accounts }) => {
  // Platform distribution data
  const platformData = accounts.reduce((acc, account) => {
    acc[account.platform] = (acc[account.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformChartData = Object.entries(platformData).map(([platform, count]) => ({
    platform,
    count,
  }));

  // Price range distribution
  const priceRanges = [
    { range: '0-100 UC', min: 0, max: 100 },
    { range: '101-500 UC', min: 101, max: 500 },
    { range: '501-1000 UC', min: 501, max: 1000 },
    { range: '1000+ UC', min: 1001, max: Infinity },
  ];

  const priceRangeData = priceRanges.map(range => ({
    range: range.range,
    count: accounts.filter(acc => acc.price >= range.min && acc.price <= range.max).length,
  }));

  // Status distribution for pie chart
  const statusData = [
    { name: 'Active', value: accounts.filter(acc => acc.status === 'active').length, color: '#8b5cf6' },
    { name: 'Sold', value: accounts.filter(acc => acc.status === 'sold').length, color: '#10b981' },
    { name: 'Pending', value: accounts.filter(acc => acc.status === 'pending').length, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // Monthly additions based on real created_at dates
  const getMonthlyData = () => {
    const monthCounts: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0 counts
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts[monthKey] = 0;
    }
    
    // Count accounts by month
    accounts.forEach(account => {
      const createdDate = new Date(account.created_at);
      const monthKey = `${monthNames[createdDate.getMonth()]} ${createdDate.getFullYear()}`;
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++;
      }
    });
    
    return Object.entries(monthCounts).map(([month, count]) => ({
      month: month.split(' ')[0], // Just the month name for display
      accounts: count,
    }));
  };
  
  const monthlyData = getMonthlyData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Platform Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>Number of accounts per platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Distribution of account statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
          <CardDescription>Accounts grouped by price ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceRangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--secondary-brand))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Growth */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Monthly Account Additions</CardTitle>
          <CardDescription>New accounts added over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accounts" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};