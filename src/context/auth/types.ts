
import { User, Session } from "@supabase/supabase-js";

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  name?: string;
  phone: string;
  organization: string;
  city: string;
  country: string;
}

export interface AuthUser {
  id: string;
  email: string;
  trialBlogsRemaining: number;
  trialEndsAt: Date;
  profile: UserProfile;
  roles: UserRole[];
  isAdmin: boolean;
}

export interface AuthContextType {
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
