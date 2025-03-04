
import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CreditCard, CheckCircle, Calendar, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Subscription = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // In a real app, subscription status would come from the backend
  // For this demo, we'll assume everyone on free trial
  const isOnFreeTrial = true;
  const daysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  
  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription? You'll lose access at the end of your current billing period.")) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Subscription cancelled",
          description: "Your subscription has been cancelled and will end at the end of your current billing period.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to cancel subscription. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleUpdatePayment = () => {
    // In a real app, this would open a payment update form
    toast({
      title: "Coming soon",
      description: "Payment method updates will be available soon.",
    });
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription</h1>
        
        {isOnFreeTrial ? (
          <div className="glass p-6 rounded-xl mb-8">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Free Trial</h2>
            </div>
            
            <p className="text-foreground/70 mb-6">
              You're currently on a free trial. You have {user?.trialBlogsRemaining} blog{user?.trialBlogsRemaining !== 1 ? 's' : ''} remaining and {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left.
            </p>
            
            {daysRemaining <= 3 && (
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-6 flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-700">Trial ending soon</h3>
                  <p className="text-sm text-yellow-600">
                    Your free trial is ending in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Subscribe now to continue using BlogCraft.
                  </p>
                </div>
              </div>
            )}
            
            <Button onClick={() => navigate("/pricing")}>
              View Pricing Plans
            </Button>
          </div>
        ) : (
          <>
            <div className="glass p-6 rounded-xl mb-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold">Active Subscription</h2>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Plan</span>
                  <span>Professional (Monthly)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Price</span>
                  <span>$59.00/month</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Next billing date</span>
                  <span>June 15, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                >
                  Change Plan
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg mb-6 flex items-center">
                <div className="h-8 w-12 bg-gray-200 rounded mr-3 flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-foreground/70">Expires 12/2025</p>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleUpdatePayment}
              >
                Update Payment Method
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
