
import React, { createContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, AuthUser } from "./types";
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  requestPasswordResetForUser, 
  resetUserPassword, 
  makeUserAdminAction,
  initializeAuthListener,
  getCurrentSession
} from "./authActions";
import { handleSessionFound } from "./authUtils";
import { Session } from "@supabase/supabase-js";

// Create the auth context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const { data: { subscription } } = initializeAuthListener(handleSession);

        // Then check for an existing session
        const session = await getCurrentSession();
        
        if (session) {
          console.log("AuthContext - Existing session found");
          // Use the same deferred execution pattern for consistency
          setTimeout(async () => {
            await handleSession(session);
          }, 0);
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

  const handleSession = async (session: Session | null) => {
    try {
      if (session) {
        const userData = await handleSessionFound(session);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error processing session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      await loginUser(email, password, profile);
      // Don't set isLoading to false here - the auth state listener will handle that
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      await signupUser(email, password, profile);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
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
      await requestPasswordResetForUser(email);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    try {
      await resetUserPassword(token, newPassword);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeUserAdmin = async (userId: string): Promise<void> => {
    try {
      await makeUserAdminAction(userId, !!user?.isAdmin);
      
      toast({
        title: "Success",
        description: "User has been promoted to admin",
      });
    } catch (error: any) {
      throw error;
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
