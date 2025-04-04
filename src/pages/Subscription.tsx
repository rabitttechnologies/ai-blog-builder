
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { SubscriptionLoading } from "@/components/subscription/SubscriptionLoading";
import { useSubscription } from "@/hooks/useSubscription";

const Subscription = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const {
    subscription,
    isLoading,
    formatDate,
    handleManageSubscription,
    trialDaysRemaining
  } = useSubscription();
  
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to Insight Writer AI.",
      });
    }
  }, [searchParams, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription - Insight Writer AI</title>
      </Helmet>

      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription</h1>
        
        {isLoading ? (
          <SubscriptionLoading />
        ) : (
          <SubscriptionStatus
            subscription={subscription}
            trialDaysRemaining={trialDaysRemaining}
            formatDate={formatDate}
            handleManageSubscription={handleManageSubscription}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
