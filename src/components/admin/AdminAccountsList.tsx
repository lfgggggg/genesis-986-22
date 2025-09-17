import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MarketplaceAccount } from '@/lib/supabase';
import { MoreHorizontal, Edit, Trash2, Eye, Users, Key } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminAccountsListProps {
  accounts: MarketplaceAccount[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onManageCredentials?: (account: MarketplaceAccount) => void;
  loading: boolean;
}

export const AdminAccountsList: React.FC<AdminAccountsListProps> = ({
  accounts,
  onDelete,
  onUpdateStatus,
  onManageCredentials,
  loading,
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-success/10 text-success border-success/20',
      sold: 'bg-muted text-muted-foreground border-border',
      pending: 'bg-warning/10 text-warning border-warning/20',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Marketplace Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Marketplace Accounts ({accounts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Account</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {account.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{account.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {account.category}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{account.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{formatNumber(account.followers)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{account.engagement_rate}%</TableCell>
                  <TableCell className="font-semibold">
                    {account.price.toLocaleString()} UC
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(account.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                          {onManageCredentials && (
                            <DropdownMenuItem onClick={() => onManageCredentials(account)}>
                              <Key className="w-4 h-4 mr-2" />
                              Manage Credentials
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(account.id, account.status === 'active' ? 'pending' : 'active')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {account.status === 'active' ? 'Set Pending' : 'Set Active'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(account.id, 'sold')}
                            disabled={account.status === 'sold'}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Mark as Sold
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(account.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {accounts.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No accounts found</div>
              <div className="text-sm text-muted-foreground">
                Add your first marketplace account to get started
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};