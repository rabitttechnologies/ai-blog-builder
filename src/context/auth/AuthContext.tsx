
import React, { createContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, UserProfile } from "./types";
import { useAuthProvider } from "./useAuthProvider";
import { 
  login as authLogin, 
  signup as authSignup, 
  logout as authLogout,
  requestPasswordReset as authRequestPasswordReset,
  resetPassword as authResetPassword,
  makeUserAdmin as authMakeUserAdmin
} from "./authMethods";

// Create the auth context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, setIsLoading } = useAuthProvider();
  const { toast } = useToast();

  const login = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      await authLogin(email, password, profile);
      // Auth state listener will handle the user state
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      await authSignup(email, password, profile);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
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
      await authRequestPasswordReset(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    try {
      await authResetPassword(token, newPassword);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeUserAdmin = async (userId: string): Promise<void> => {
    try {
      await authMakeUserAdmin(userId, !!user?.isAdmin);
      
      toast({
        title: "Success",
        description: "User has been promoted to admin",
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
