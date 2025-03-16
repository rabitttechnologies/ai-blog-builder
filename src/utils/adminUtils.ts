
import { supabase } from "@/integrations/supabase/client";

export const makeUserAdminByEmail = async (email: string): Promise<boolean> => {
  try {
    // First, get the user by email using a direct query instead of filters
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);

    if (userError || !userData.user) {
      console.error("User not found:", userError);
      return false;
    }

    const userId = userData.user.id;

    // Add admin role to the user using raw SQL query instead of type-checked insert
    // This works around the TypeScript limitations until the types are regenerated
    const { error } = await supabase.rpc('add_user_admin_role', {
      user_id_param: userId
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
