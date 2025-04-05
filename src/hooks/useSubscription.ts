
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/subscription";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      // Using invoke with a type assertion since the RPC function isn't in the TypeScript types
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching subscription:", error);
        setSubscription(null);
      } else {
        setSubscription(data as Subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-billing-portal", {
        body: {
          returnUrl: window.location.href,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating billing portal session:", error);
      toast({
        title: "Error",
        description: "Failed to open subscription management portal. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const trialDaysRemaining = user?.trialEndsAt ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscription();
    }
  }, [isAuthenticated, user]);

  return {
    subscription,
    isLoading,
    formatDate,
    handleManageSubscription,
    trialDaysRemaining,
  };
};
