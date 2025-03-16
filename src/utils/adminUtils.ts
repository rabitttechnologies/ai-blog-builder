
import { supabase } from "@/integrations/supabase/client";

// Define a type for the user object returned by auth.admin.listUsers()
interface AuthUser {
  id: string;
  email?: string;
  // Add other properties as needed
}

export const makeUserAdminByEmail = async (email: string): Promise<boolean> => {
  try {
    // We can't directly query auth.users through the client API
    // Instead, we'll use the auth.admin.listUsers() method to find the user by email
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Failed to list users:", listError);
      return false;
    }
    
    // Find the user with matching email
    // Cast to our defined type to help TypeScript understand the structure
    const user = (authUsers.users as AuthUser[]).find(u => u.email === email);
    
    if (!user) {
      console.error("User not found with email:", email);
      return false;
    }
    
    // Call function to add admin role
    const { error } = await supabase.rpc('add_user_admin_role', {
      user_id_param: user.id
    });
    
    if (error) {
      console.error("Error setting admin role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in makeUserAdminByEmail:", error);
    return false;
  }
};
