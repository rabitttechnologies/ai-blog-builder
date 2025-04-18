import React, { createContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, AuthUser, UserProfile } from "./types";
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("AuthContext - Initializing auth state");
        setIsLoading(true);
        
        // First set up the auth state listener to catch any authentication changes
        const { data: { subscription } } = initializeAuthListener((event, newSession) => {
          // Only do synchronous state updates in the callback
          console.log("AuthContext - Auth state changed:", event);
          setSession(newSession);
          
          // Use setTimeout to prevent potential deadlocks with Supabase
          if (newSession) {
            setTimeout(async () => {
              await handleSession(newSession);
            }, 0);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        });

        // Then check for an existing session
        const currentSession = await getCurrentSession();
        
        if (currentSession) {
          console.log("AuthContext - Existing session found");
          setSession(currentSession);
          // Use setTimeout to prevent potential deadlocks with Supabase
          setTimeout(async () => {
            await handleSession(currentSession);
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
        } else {
          // Handle case where user data processing fails
          console.log("AuthContext - Failed to process user data, but keeping session");
          // We still consider the user authenticated even if profile loading fails
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            trialBlogsRemaining: 2,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            profile: {
              name: session.user.user_metadata.name || '',
              phone: session.user.user_metadata.phone || '',
              organization: session.user.user_metadata.organization || '',
              city: session.user.user_metadata.city || '',
              country: session.user.user_metadata.country || ''
            },
            roles: ['user'],
            isAdmin: false
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error processing session:", error);
      // Provide a fallback user object with minimal permissions
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          trialBlogsRemaining: 2,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          profile: {
            name: session.user.user_metadata.name || '',
            phone: '',
            organization: '',
            city: '',
            country: ''
          },
          roles: ['user'],
          isAdmin: false
        });
      }
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
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        session,
        isAuthenticated: !!user && !!session,
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

export default AuthProvider;
