
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  PRICING_PLANS, 
  PlanType, 
  PricingPeriod, 
  getMonthlyPriceForYearly,
  TRIAL_LENGTH_DAYS 
} from "@/constants/pricing";

const Pricing = () => {
  const [period, setPeriod] = useState<PricingPeriod>("monthly");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: PlanType) => {
    if (!isAuthenticated) {
      navigate("/signup");
    } else {
      navigate("/subscription/checkout", { state: { plan, period } });
    }
  };

  return (
    <>
      <Header />
      <div className="py-16 px-4 bg-gradient-to-b from-background/50 to-background/10">
        <Helmet>
          <title>Pricing - BlogCraft</title>
        </Helmet>
        
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating SEO-optimized blogs today
          </p>
          
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 p-1 rounded-full">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  period === "monthly" ? "bg-white shadow-sm" : "text-foreground/70"
                }`}
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  period === "yearly" ? "bg-white shadow-sm" : "text-foreground/70"
                }`}
                onClick={() => setPeriod("yearly")}
              >
                Yearly <span className="text-green-600 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`glass p-8 rounded-xl relative ${
                  plan.popular ? "border-2 border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-foreground/70 text-sm h-12">{plan.description}</p>
                
                <div className="mt-6 mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      ${period === "monthly" ? plan.priceMonthly : getMonthlyPriceForYearly(plan.id)}
                    </span>
                    <span className="text-foreground/70 ml-2">
                      /month
                    </span>
                  </div>
                  {period === "yearly" && (
                    <div className="text-sm text-foreground/70 mt-1">
                      Billed annually (${plan.priceYearly})
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={plan.popular ? "primary" : "outline"} 
                  fullWidth 
                  className="mb-8"
                  onClick={() => handleSelectPlan(plan.id as PlanType)}
                >
                  {isAuthenticated ? "Select Plan" : `Start ${TRIAL_LENGTH_DAYS}-Day Free Trial`}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-foreground/70 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens after my free trial?</h3>
                <p className="text-foreground/70 text-sm">After your {TRIAL_LENGTH_DAYS}-day trial expires, you'll need to choose a plan to continue using BlogCraft.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-foreground/70 text-sm">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-foreground/70 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
