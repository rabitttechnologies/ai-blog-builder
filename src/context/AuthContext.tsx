import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  name?: string;
  phone: string;
  organization: string;
  city: string;
  country: string;
}

interface User {
  id: string;
  email: string;
  trialBlogsRemaining: number;
  trialEndsAt: Date;
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, profile?: Partial<UserProfile>) => Promise<void>;
  signup: (email: string, password: string, profile?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem("blogcraft_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Convert string date to Date object
        parsedUser.trialEndsAt = new Date(parsedUser.trialEndsAt);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("blogcraft_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing user profile from localStorage or create a new one
      let existingProfile: UserProfile = {
        phone: "",
        organization: "",
        city: "",
        country: ""
      };
      
      // Combine existing profile with the new profile data
      const updatedProfile = {
        ...existingProfile,
        ...profile
      };
      
      // Mock user data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        email,
        trialBlogsRemaining: 2,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        profile: updatedProfile as UserProfile
      };
      
      setUser(mockUser);
      localStorage.setItem("blogcraft_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, profile?: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a default profile and merge with provided profile
      const userProfile: UserProfile = {
        phone: "",
        organization: "",
        city: "",
        country: "",
        ...profile
      };
      
      // Mock user data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        email,
        trialBlogsRemaining: 2,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        profile: userProfile
      };
      
      setUser(mockUser);
      localStorage.setItem("blogcraft_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blogcraft_user");
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would send an email with a reset link
      console.log(`Password reset requested for ${email}`);
      
      // For demo, we'll store the token in localStorage to simulate the email link
      const resetToken = "reset_" + Math.random().toString(36).substring(2, 15);
      const resetData = {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour from now
      };
      
      localStorage.setItem("blogcraft_reset_token", JSON.stringify(resetData));
      
      // In a real app, this would send an email with a link like:
      // https://yourdomain.com/reset-password?token=resetToken
    } catch (error) {
      console.error("Password reset request error:", error);
      throw new Error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate token (in a real app, this would verify against a database)
      const resetDataString = localStorage.getItem("blogcraft_reset_token");
      
      if (!resetDataString) {
        throw new Error("Invalid or expired reset token. Please request a new password reset.");
      }
      
      const resetData = JSON.parse(resetDataString);
      
      // Check if token is valid and not expired
      if (resetData.token !== token || new Date(resetData.expiresAt) < new Date()) {
        localStorage.removeItem("blogcraft_reset_token");
        throw new Error("Invalid or expired reset token. Please request a new password reset.");
      }
      
      // In a real app, this would update the user's password in the database
      console.log(`Password reset completed for ${resetData.email}`);
      
      // For demo purposes, if we have a saved user with this email, update their entry
      const savedUser = localStorage.getItem("blogcraft_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === resetData.email) {
          // In a real app, we'd hash the password before storing it
          // Here we're just simulating the process
          localStorage.setItem("blogcraft_user", JSON.stringify(parsedUser));
        }
      }
      
      // Clear the reset token
      localStorage.removeItem("blogcraft_reset_token");
    } catch (error) {
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
