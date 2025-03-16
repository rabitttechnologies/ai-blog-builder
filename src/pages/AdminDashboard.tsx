
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { AlertCircle, User, UserCheck, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface UserListItem {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
}

const AdminDashboard = () => {
  const { user, isAuthenticated, makeUserAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Get all users from the auth.users table (via profiles since we can't query auth directly)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, created_at');
        
        if (profilesError) throw profilesError;
        
        // Get all admins
        const { data: adminRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');
        
        if (rolesError) throw rolesError;
        
        // Extract admin user IDs for easier checking
        const adminUserIds = new Set(adminRoles.map(r => r.user_id));
        
        // Get user emails from auth metadata
        const userEmails = await Promise.all(
          profiles.map(async (profile) => {
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
            return {
              id: profile.id,
              email: authUser?.user?.email || 'Unknown email',
              created_at: profile.created_at,
              isAdmin: adminUserIds.has(profile.id)
            };
          })
        );
        
        setUsers(userEmails);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. You may not have admin privileges.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  // Redirect if not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAuthenticated && !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleMakeAdmin = async (userId: string) => {
    try {
      setPromotingUserId(userId);
      await makeUserAdmin(userId);
      
      // Update the local state
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

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Helmet>
        <title>Admin Dashboard - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-foreground/70">Manage users and system settings</p>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p>No users found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/40">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <UserCheck className="mr-1 h-3 w-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <User className="mr-1 h-3 w-3" />
                              User
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {!user.isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMakeAdmin(user.id)}
                            isLoading={promotingUserId === user.id}
                            disabled={promotingUserId === user.id}
                          >
                            Make Admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
