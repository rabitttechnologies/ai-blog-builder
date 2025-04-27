import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";

interface UserListItem {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const { user, makeUserAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Get users through the Edge Function
        const { data: { users }, error: usersError } = await supabase.functions.invoke('admin-operations', {
          body: { operation: 'listUsers' }
        });
        
        if (usersError) throw usersError;
        
        const { data: adminRolesData, error: rolesError } = await supabase
          .rpc('get_all_admin_users');
        
        if (rolesError) throw rolesError;
        
        const adminUserIds = new Set(adminRolesData.map((r: {user_id: string}) => r.user_id));
        
        const userEmails = users.map((authUser: any) => ({
          id: authUser.id,
          email: authUser.email || 'Unknown email',
          created_at: authUser.created_at,
          isAdmin: adminUserIds.has(authUser.id)
        }));
        
        setUsers(userEmails);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load users. You may not have admin privileges.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user, toast]);

  const handleMakeAdmin = async (userId: string) => {
    try {
      setPromotingUserId(userId);
      await makeUserAdmin(userId);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: true } : u
      ));
      
      toast({
        title: "Success",
        description: "User has been promoted to admin",
      });
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to promote user to admin",
        variant: "destructive",
      });
    } finally {
      setPromotingUserId(null);
    }
  };

  return {
    users,
    isLoading,
    promotingUserId,
    handleMakeAdmin
  };
};
