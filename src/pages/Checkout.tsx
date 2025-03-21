
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
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
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid card number");
      return;
    }
    
    if (!cardName) {
      setError("Please enter the name on card");
      return;
    }
    
    if (expiry.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY)");
      return;
    }
    
    if (cvc.length !== 3) {
      setError("Please enter a valid CVC");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      toast({
        title: "Subscription successful",
        description: `You are now subscribed to the ${planDetails?.name || selectedPlan} plan.`,
      });
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
        <Helmet>
          <title>Subscription Confirmed - BlogCraft</title>
        </Helmet>
        
        <div className="glass p-8 rounded-xl max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Subscription Confirmed!</h2>
          <p className="text-foreground/70 mb-6">
            Thank you for subscribing to BlogCraft's {planDetails?.name || selectedPlan} plan. Your subscription is now active.
          </p>
          <Button 
            onClick={() => navigate("/dashboard")}
            fullWidth
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Checkout - BlogCraft</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-primary hover:underline mb-6 inline-flex items-center"
        >
          ← Back to pricing
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Complete your subscription</h2>
        <p className="text-foreground/70 mb-8">You're subscribing to the {planDetails?.name || selectedPlan} plan.</p>
        
        <div className="glass p-6 rounded-xl">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
            <div>
              <h3 className="font-semibold">{planDetails?.name || selectedPlan} Plan ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})</h3>
              <p className="text-foreground/70 text-sm">{user?.email}</p>
            </div>
            <div className="text-right">
              {selectedPeriod === "yearly" ? (
                <>
                  <p className="font-bold">${monthlyPrice}/month</p>
                  <p className="text-foreground/70 text-sm">(${price} billed annually)</p>
                </>
              ) : (
                <>
                  <p className="font-bold">${price}</p>
                  <p className="text-foreground/70 text-sm">per month</p>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  id="cardNumber"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                Name on Card
              </label>
              <input
                id="cardName"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                placeholder="John Smith"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiry"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
            >
              {selectedPeriod === "yearly" ? (
                <>Subscribe for ${monthlyPrice}/month</>
              ) : (
                <>Subscribe for ${price}/month</>
              )}
            </Button>
            
            <p className="text-xs text-foreground/60 text-center pt-2">
              Your payment is secure and encrypted. By subscribing, you agree to our 
              <a href="/terms" className="text-primary hover:underline"> Terms of Service</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
