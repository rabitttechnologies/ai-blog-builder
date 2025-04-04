
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, CreditCard, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  plan_id: string;
  period: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

const Subscription = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscription();
    }
    
    const success = searchParams.get("success");
    if (success === "true") {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to Insight Writer AI.",
      });
    }
  }, [isAuthenticated, user]);
  
  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      // Using custom query instead of .from('subscriptions') since TypeScript doesn't know about our table yet
      const { data, error } = await supabase
        .rpc('get_user_subscription');
      
      if (error) {
        throw error;
      }
      
      setSubscription(data || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const trialDaysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const hasActiveSubscription = subscription && subscription.status === "active";

  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription - Insight Writer AI</title>
      </Helmet>

      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription</h1>
        
        {isLoading ? (
          <div className="glass p-6 rounded-xl text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : hasActiveSubscription ? (
          <div className="glass p-6 rounded-xl space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Active Subscription</h2>
                <p className="text-foreground/70">
                  You're currently subscribed to the {subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1)} plan.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-4 w-4 mr-2 text-foreground/70" />
                  <h3 className="font-medium">Billing Information</h3>
                </div>
                <p className="text-sm text-foreground/70">
                  {subscription.period === "yearly" ? "Annual" : "Monthly"} subscription
                </p>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-foreground/70" />
                  <h3 className="font-medium">Current Period</h3>
                </div>
                <p className="text-sm text-foreground/70">
                  Renews on {formatDate(subscription.current_period_end)}
                </p>
              </div>
            </div>
            
            {subscription.cancel_at_period_end && (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Subscription Cancellation</h3>
                  <p className="text-sm">
                    Your subscription has been canceled and will end on {formatDate(subscription.current_period_end)}.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <Button onClick={handleManageSubscription} rightIcon={<RefreshCw className="h-4 w-4" />}>
                Manage Subscription
              </Button>
            </div>
          </div>
        ) : user && trialDaysRemaining > 0 ? (
          <div className="glass p-6 rounded-xl">
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Free Trial Active</h3>
                <p className="text-sm">
                  You have {trialDaysRemaining} days left in your free trial.
                </p>
              </div>
            </div>
            <Button onClick={() => window.location.href = "/pricing"}>Upgrade Now</Button>
          </div>
        ) : (
          <div className="glass p-6 rounded-xl">
            <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
              <h3 className="font-medium">No Active Subscription</h3>
              <p className="text-sm">
                You don't have an active subscription. Choose a plan to unlock all features.
              </p>
            </div>
            <Button onClick={() => window.location.href = "/pricing"}>See Pricing Plans</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
