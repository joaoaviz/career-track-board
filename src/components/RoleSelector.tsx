import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const RoleSelector: React.FC = () => {
  const { userRole, loading } = useUserRole();
  const { user } = useAuth();

  const handleRoleChange = async (newRole: UserRole) => {
    if (!user) return;

    try {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: newRole });

      if (error) throw error;

      toast.success('Rôle mis à jour avec succès');
      window.location.reload(); // Refresh to update permissions
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  if (loading) {
    return <div>Chargement du rôle...</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="role-select">Rôle utilisateur</Label>
      <Select 
        value={userRole || 'user'} 
        onValueChange={handleRoleChange}
        name="role-select"
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Utilisateur</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {userRole === 'manager' 
          ? 'En tant que manager, vous pouvez voir toutes les candidatures.' 
          : 'En tant qu\'utilisateur, vous ne voyez que vos propres candidatures.'
        }
      </p>
    </div>
  );
};