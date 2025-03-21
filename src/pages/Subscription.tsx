import React from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth";
import { CheckCircle } from "lucide-react";

const Subscription = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const trialDaysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription - BlogCraft</title>
      </Helmet>

      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription</h1>

        <div className="glass p-6 rounded-xl">
          {user && trialDaysRemaining > 0 ? (
            <>
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
            </>
          ) : user && trialDaysRemaining <= 0 ? (
            <>
              <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                <h3 className="font-medium">Trial Expired</h3>
                <p className="text-sm">
                  Your free trial has expired. Upgrade to a paid plan to continue
                  creating amazing content.
                </p>
              </div>
              <Button onClick={() => window.location.href = "/pricing"}>See Pricing Plans</Button>
            </>
          ) : (
            <p>Loading subscription information...</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
