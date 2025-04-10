
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

export async function login(
  email: string, 
  password: string, 
  profile?: Partial<UserProfile>
): Promise<void> {
  console.log("AuthContext - Login attempt starting for:", email);
  
  try {
    // Set the session to expire in 7 days (fixed in the Supabase client configuration)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("AuthContext - Login error:", error);
      throw error;
    }
    
    console.log("AuthContext - Login successful for:", email);

    // If additional profile data is provided, update user metadata
    if (profile && Object.keys(profile).length > 0 && data.user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: profile
      });
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
    }
    
    // The auth state listener will handle setting the user and isLoading
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed. Please check your credentials and try again.");
  }
}

export async function signup(
  email: string, 
  password: string, 
  profile?: Partial<UserProfile>
): Promise<void> {
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
}

export async function logout(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  } catch (error: any) {
    console.error("Password reset request error:", error);
    throw new Error(error.message || "Failed to send password reset email. Please try again.");
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
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
}

export async function makeUserAdmin(userId: string, isCurrentUserAdmin: boolean): Promise<void> {
  if (!isCurrentUserAdmin) {
    throw new Error("Only administrators can promote users to admin role");
  }
  
  try {
    // Check if user exists
    const { data: userExists, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId as string)
      .single();
    
    if (userError || !userExists) {
      throw new Error("User not found");
    }
    
    // Add admin role using our safe RPC function
    const { error } = await supabase
      .rpc('add_user_admin_role', { user_id_param: userId as string });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Error making user admin:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to make user admin");
  }
}
