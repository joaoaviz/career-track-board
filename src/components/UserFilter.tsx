import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface UserFilterProps {
  selectedUserId: string | null;
  onUserChange: (userId: string | null) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  selectedUserId,
  onUserChange,
}) => {
  const { userRole } = useUserRole();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'manager') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_for_manager');
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'manager') {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="user-filter">Filtrer par utilisateur</Label>
      <Select 
        value={selectedUserId || "all"} 
        onValueChange={(value) => onUserChange(value === "all" ? null : value)}
        name="user-filter"
      >
        <SelectTrigger>
          <SelectValue placeholder="Tous les utilisateurs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les utilisateurs</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.full_name || user.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};