
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSessionFound } from "./authUtils";
import { AuthUser, UserProfile } from "./types";

export function useAuthProvider() {
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
          (event, session) => {
            console.log("AuthContext - Auth state changed:", event);
            
            if (session) {
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                console.log("AuthContext - User authenticated or token refreshed");
                // Use setTimeout to prevent auth deadlock
                setTimeout(async () => {
                  const userData = await handleSessionFound(session);
                  if (userData) {
                    setUser(userData);
                  }
                  setIsLoading(false);
                }, 0);
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

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    setIsLoading
  };
}
