import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Eye, EyeOff, Key, Save } from 'lucide-react';

interface Credential {
  id: string;
  field_name: string;
  field_value: string;
  field_order: number;
}

interface CredentialsManagerProps {
  accountId: string;
  accountUsername: string;
}

const DEFAULT_FIELDS = [
  'Username/Email',
  'Password',
  '2FA Recovery Codes',
  'Backup Email',
  'Backup Email Password',
  'Security Question',
  'Security Answer',
  'Linked Phone Number',
  'Phone Number PIN',
  'API Keys/Tokens',
  'Billing Address',
  'Business Manager ID',
  'Page Access Token',
  'Proxy Details',
  'Recovery Instructions',
  'Notes/Extra Instructions'
];

export const CredentialsManager: React.FC<CredentialsManagerProps> = ({
  accountId,
  accountUsername
}) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({ name: '', value: '' });

  useEffect(() => {
    fetchCredentials();
  }, [accountId]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('account_credentials')
        .select('*')
        .eq('account_id', accountId)
        .order('field_order', { ascending: true });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCredential = async () => {
    if (!newField.name.trim() || !newField.value.trim()) {
      toast({
        title: "Error",
        description: "Please provide both field name and value",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('account_credentials')
        .insert({
          account_id: accountId,
          field_name: newField.name,
          field_value: newField.value,
          field_order: credentials.length
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credential added successfully",
      });

      setNewField({ name: '', value: '' });
      setIsAddingField(false);
      fetchCredentials();
    } catch (error) {
      console.error('Error adding credential:', error);
      toast({
        title: "Error",
        description: "Failed to add credential",
        variant: "destructive",
      });
    }
  };

  const updateCredential = async (id: string, field_value: string) => {
    try {
      const { error } = await supabase
        .from('account_credentials')
        .update({ field_value })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credential updated successfully",
      });

      fetchCredentials();
    } catch (error) {
      console.error('Error updating credential:', error);
      toast({
        title: "Error",
        description: "Failed to update credential",
        variant: "destructive",
      });
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      const { error } = await supabase
        .from('account_credentials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credential deleted successfully",
      });

      fetchCredentials();
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast({
        title: "Error",
        description: "Failed to delete credential",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return <div className="text-center p-8">Loading credentials...</div>;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Account Credentials
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Managing credentials for <strong>{accountUsername}</strong>
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            {credentials.length}/30 fields
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {credentials.map((credential) => (
          <div key={credential.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card/50">
            <div className="flex-1">
              <Label className="text-sm font-medium">{credential.field_name}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type={showValues[credential.id] ? 'text' : 'password'}
                  value={credential.field_value}
                  onChange={(e) => updateCredential(credential.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisibility(credential.id)}
                >
                  {showValues[credential.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCredential(credential.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {credentials.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No credentials added yet. Add your first credential to get started.
          </div>
        )}

        {credentials.length < 30 && (
          <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Credential Field
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Add New Credential</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  >
                    <option value="">Select or type custom field...</option>
                    {DEFAULT_FIELDS.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Or enter custom field name"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Value</Label>
                  <Input
                    type="password"
                    placeholder="Enter credential value"
                    value={newField.value}
                    onChange={(e) => setNewField(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addCredential} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Credential
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingField(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};