
import React from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle, CreditCard, Calendar, RefreshCw } from "lucide-react";
import { Subscription } from "@/types/subscription";

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  trialDaysRemaining: number;
  formatDate: (dateString: string) => string;
  handleManageSubscription: () => Promise<void>;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  subscription,
  trialDaysRemaining,
  formatDate,
  handleManageSubscription,
}) => {
  const hasActiveSubscription = subscription && subscription.status === "active";

  if (hasActiveSubscription) {
    return (
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
    );
  } else if (trialDaysRemaining > 0) {
    return (
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
    );
  } else {
    return (
      <div className="glass p-6 rounded-xl">
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          <h3 className="font-medium">No Active Subscription</h3>
          <p className="text-sm">
            You don't have an active subscription. Choose a plan to unlock all features.
          </p>
        </div>
        <Button onClick={() => window.location.href = "/pricing"}>See Pricing Plans</Button>
      </div>
    );
  }
};
