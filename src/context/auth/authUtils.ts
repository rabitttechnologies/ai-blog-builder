
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, UserProfile, UserRole } from "./types";

export async function handleSessionFound(session: Session): Promise<AuthUser | null> {
  try {
    const supabaseUser = session.user;
    console.log("AuthContext - Processing session for user:", supabaseUser.id);
    
    // Try to get existing profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching user profile:", profileError);
      // Continue execution even if profile fetch fails
    }
    
    // Get user roles with graceful error handling
    let roles: UserRole[] = ['user']; // Default role
    let isAdmin = false;
    
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_user_roles', { user_id_param: supabaseUser.id });
      
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        // Continue with default role
      } else if (rolesData && Array.isArray(rolesData) && rolesData.length > 0) {
        roles = rolesData.map((r: {role: string}) => r.role as UserRole);
        console.log("Extracted roles:", roles);
        isAdmin = roles.includes('admin');
      }
    } catch (roleError) {
      console.error("Unexpected error fetching roles:", roleError);
      // Continue with default role
    }
    
    console.log("Is admin:", isAdmin);
    
    // Default profile values
    const defaultProfile: UserProfile = {
      name: supabaseUser.user_metadata.name || '',
      phone: supabaseUser.user_metadata.phone || '',
      organization: supabaseUser.user_metadata.organization || '',
      city: supabaseUser.user_metadata.city || '',
      country: supabaseUser.user_metadata.country || ''
    };
    
    // Use profile from DB if it exists, otherwise use metadata
    const profile = profileData || defaultProfile;
    
    // Return formatted user data with proper role handling
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      trialBlogsRemaining: profileData?.trial_blogs_remaining ?? 2,
      trialEndsAt: profileData?.trial_ends_at ? new Date(profileData.trial_ends_at) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      profile: {
        name: profile.name,
        phone: profile.phone || '',
        organization: profile.organization || '',
        city: profile.city || '',
        country: profile.country || ''
      },
      roles,
      isAdmin
    };
  } catch (error) {
    console.error("Error processing authenticated user:", error);
    // Returning null rather than throwing to prevent authentication flow from breaking
    return null;
  }
}
