
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { handleSessionFound } from "./authUtils";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

export const loginUser = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
  try {
    console.log("AuthActions - Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    console.log("AuthActions - Login successful for:", email);

    // If additional profile data is provided, update user metadata
    if (profile && Object.keys(profile).length > 0 && data.user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: profile
      });
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
    }
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed. Please check your credentials and try again.");
  }
};

export const signupUser = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profile || {}
      }
    });
    
    if (error) throw error;
    
    // Check if email confirmation is required
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error("This email is already registered. Please sign in instead.");
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Signup failed. Please try again.");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any lingering cookies to ensure complete logout
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (name.trim().startsWith('sb-')) {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict`;
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const requestPasswordResetForUser = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  } catch (error: any) {
    console.error("Password reset request error:", error);
    throw new Error(error.message || "Failed to send password reset email. Please try again.");
  }
};

export const resetUserPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // In Supabase, this is handled by updating the user's password
    // The token is already in the URL and handled by Supabase automatically
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to reset password. Please try again.");
  }
};

export const makeUserAdminAction = async (userId: string, currentUserIsAdmin: boolean): Promise<void> => {
  if (!currentUserIsAdmin) {
    throw new Error("Only administrators can promote users to admin role");
  }
  
  try {
    // Check if user exists
    const { data: userExists, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError || !userExists) {
      throw new Error("User not found");
    }
    
    // Add admin role using our safe RPC function
    const { error } = await supabase
      .rpc('add_user_admin_role', { user_id_param: userId });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Error making user admin:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to make user admin");
  }
};

export const initializeAuthListener = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return null;
  }
};
