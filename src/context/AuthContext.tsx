import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name?: string;
  phone: string;
  organization: string;
  city: string;
  country: string;
}

type UserRole = 'user' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  trialBlogsRemaining: number;
  trialEndsAt: Date;
  profile: UserProfile;
  roles: UserRole[];
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, profile?: Partial<UserProfile>) => Promise<void>;
  signup: (email: string, password: string, profile?: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  makeUserAdmin: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("AuthContext - Initializing auth state");
        setIsLoading(true);
        
        // First set up the auth state listener to catch any authentication changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("AuthContext - Auth state changed:", event);
            
            if (session) {
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                console.log("AuthContext - User authenticated or token refreshed");
                await handleSessionFound(session);
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("AuthContext - User signed out");
              setUser(null);
              setIsLoading(false);
            }
          }
        );

        // Then check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthContext - Existing session found");
          await handleSessionFound(session);
        } else {
          console.log("AuthContext - No existing session found");
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleSessionFound = async (session: Session) => {
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
      }
      
      // Get user roles - using a raw query to workaround type issues
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_user_roles', { user_id_param: supabaseUser.id });
      
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      }
      
      // Extract roles from the result
      const roles = rolesData?.map((r: {role: string}) => r.role as UserRole) || ['user'];
      const isAdmin = roles.includes('admin');
      
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
      
      // Set user state
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        trialBlogsRemaining: profileData?.trial_blogs_remaining ?? 2, // Use DB value or default
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
      });
      
      console.log("AuthContext - User fully authenticated:", supabaseUser.email);
    } catch (error) {
      console.error("Error processing authenticated user:", error);
      toast({
        title: "Profile Error",
        description: "There was a problem loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("AuthContext - Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
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
      
      // Don't set isLoading to false here - the auth state listener will handle that
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw new Error(error.message || "Login failed. Please check your credentials and try again.");
    }
  };

  const signup = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Password reset request error:", error);
      throw new Error(error.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const makeUserAdmin = async (userId: string): Promise<void> => {
    if (!user?.isAdmin) {
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
      
      toast({
        title: "Success",
        description: "User has been promoted to admin",
      });
    } catch (error: any) {
      console.error("Error making user admin:", error);
      throw error instanceof Error 
        ? error 
        : new Error("Failed to make user admin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        makeUserAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
