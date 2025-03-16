
import { supabase } from "@/integrations/supabase/client";

export const makeUserAdminByEmail = async (email: string): Promise<boolean> => {
  try {
    // First, get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
      filters: {
        email: email
      }
    });

    if (userError || !userData.users.length) {
      console.error("User not found:", userError);
      return false;
    }

    const userId = userData.users[0].id;

    // Add admin role to the user
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
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
