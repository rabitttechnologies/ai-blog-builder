
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

interface AuthUser {
  id: string;
  email: string;
  trialBlogsRemaining: number;
  trialEndsAt: Date;
  profile: UserProfile;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleSessionFound(session);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await handleSessionFound(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const handleSessionFound = async (session: Session) => {
    try {
      const supabaseUser = session.user;
      
      // Try to get existing profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", profileError);
      }
      
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
        }
      });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;

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
    } finally {
      setIsLoading(false);
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
