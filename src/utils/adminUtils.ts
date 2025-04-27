
import { supabase } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  email?: string;
}

export const makeUserAdminByEmail = async (email: string): Promise<boolean> => {
  try {
    // First get the user ID from email
    const { data: { users }, error: listError } = await supabase.functions.invoke('admin-operations', {
      body: { operation: 'listUsers' }
    });
    
    if (listError) {
      console.error("Failed to list users:", listError);
      return false;
    }
    
    const user = users.find((u: AuthUser) => u.email === email);
    
    if (!user) {
      console.error("User not found with email:", email);
      return false;
    }
    
    // Call function to add admin role
    const { error } = await supabase.functions.invoke('admin-operations', {
      body: { 
        operation: 'makeAdmin',
        data: { userId: user.id }
      }
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
