
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/auth";
import { CreditCard, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  PlanType, 
  PricingPeriod, 
  getPlanPrice, 
  getPlanById,
  getMonthlyPriceForYearly
} from "@/constants/pricing";

interface LocationState {
  plan: PlanType;
  period: PricingPeriod;
}

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const state = location.state as LocationState;
  if (!state?.plan || !state?.period) {
    return <Navigate to="/pricing" />;
  }
  
  const selectedPlan = state.plan;
  const selectedPeriod = state.period;
  const price = getPlanPrice(selectedPlan, selectedPeriod);
  const monthlyPrice = selectedPeriod === "yearly" ? getMonthlyPriceForYearly(selectedPlan) : price;
  const planDetails = getPlanById(selectedPlan);
  
  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          planId: selectedPlan,
          period: selectedPeriod,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to create checkout session. Please try again.");
      toast({
        title: "Checkout Failed",
        description: "There was a problem creating your checkout session. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Checkout - Insight Writer AI</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <button 
          onClick={() => navigate("/pricing")}
          className="text-primary hover:underline mb-6 inline-flex items-center"
        >
          ← Back to pricing
        </button>
        
        <h1 className="text-3xl font-bold mb-6">Complete your subscription</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="glass p-6 rounded-xl">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Secure Payment</h2>
                <p className="text-foreground/70 mb-4">
                  Click the button below to securely complete your purchase with Stripe.
                </p>
                
                <Button
                  onClick={handleCheckout}
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<Lock className="h-4 w-4" />}
                >
                  Proceed to Payment
                </Button>
                
                <div className="mt-4 flex items-center justify-center text-xs text-foreground/60">
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ol className="text-sm text-foreground/70 space-y-2">
                  <li>1. You'll be redirected to Stripe's secure checkout page</li>
                  <li>2. Enter your payment details to complete the subscription</li>
                  <li>3. You'll be redirected back to our platform after a successful payment</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div>
            <div className="glass p-6 rounded-xl sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="bg-secondary/20 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{planDetails?.name} Plan</h3>
                    <p className="text-sm text-foreground/70">
                      {selectedPeriod === "yearly" ? "Annual billing" : "Monthly billing"}
                    </p>
                  </div>
                  <div className="text-right">
                    {selectedPeriod === "yearly" ? (
                      <>
                        <p className="font-bold">${monthlyPrice}/mo</p>
                        <p className="text-xs text-foreground/70">(${price} billed yearly)</p>
                      </>
                    ) : (
                      <p className="font-bold">${price}/month</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>${price}</span>
                </div>
                
                {selectedPeriod === "yearly" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Annual discount</span>
                    <span className="text-green-600">-${(planDetails?.priceMonthly || 0) * 12 - price}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total due today</span>
                  <span>${price}</span>
                </div>
              </div>
              
              <div className="text-xs text-foreground/60">
                <p>By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
