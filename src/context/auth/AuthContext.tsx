
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSessionFound } from "./authUtils";
import { AuthContextType, UserProfile } from "./types";

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
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
                const userData = await handleSessionFound(session);
                if (userData) {
                  setUser(userData);
                }
                setIsLoading(false);
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
          const userData = await handleSessionFound(session);
          if (userData) {
            setUser(userData);
          }
          setIsLoading(false);
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
