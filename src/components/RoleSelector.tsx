import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export const RoleSelector: React.FC = () => {
  const { userRole, loading } = useUserRole();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (userRole === 'manager') {
      fetchAllUsers();
    }
  }, [userRole]);

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_for_manager');
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!user) return;

    try {
      // Delete existing role for the user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast.success('Rôle mis à jour avec succès');
      fetchAllUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  if (loading) {
    return <div>Chargement du rôle...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Mon rôle actuel</Label>
        <p className="text-sm font-medium">
          {userRole === 'manager' ? 'Manager' : 'Utilisateur'}
        </p>
        <p className="text-sm text-muted-foreground">
          {userRole === 'manager' 
            ? 'En tant que manager, vous pouvez voir toutes les candidatures et gérer les rôles.' 
            : 'En tant qu\'utilisateur, vous ne voyez que vos propres candidatures.'
          }
        </p>
      </div>

      {userRole === 'manager' && (
        <div className="space-y-4">
          <Label>Gestion des rôles utilisateurs</Label>
          {loadingUsers ? (
            <div>Chargement des utilisateurs...</div>
          ) : (
            <div className="space-y-3">
              {users.map((userItem) => (
                <div key={userItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{userItem.full_name || 'Sans nom'}</p>
                    <p className="text-sm text-muted-foreground">{userItem.email}</p>
                  </div>
                  <Select 
                    value={userItem.role} 
                    onValueChange={(newRole) => handleRoleChange(userItem.id, newRole as UserRole)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAllUsers}
            disabled={loadingUsers}
          >
            Actualiser la liste
          </Button>
        </div>
      )}
    </div>
  );
};