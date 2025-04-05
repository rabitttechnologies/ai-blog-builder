
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/context/auth";
import { PricingPeriod } from "@/constants/pricing";

// Import pricing components
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import PricingFeatures from "@/components/pricing/PricingFeatures";
import PricingFAQ from "@/components/pricing/PricingFAQ";

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<PricingPeriod>("yearly");

  const handlePlanSelect = (planId: string) => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to signup with plan info
      navigate('/signup', { state: { selectedPlan: planId, billingPeriod } });
    } else {
      // If authenticated, redirect to checkout with plan info
      navigate('/subscription/checkout', { 
        state: { 
          plan: planId, 
          period: billingPeriod 
        } 
      });
    }
  };

  // Use appropriate layout based on authentication status
  const Layout = isAuthenticated ? DashboardLayout : PublicLayout;

  console.log("Rendering Pricing page with layout:", isAuthenticated ? "DashboardLayout" : "PublicLayout");

  return (
    <Layout>
      <Helmet>
        <title>Pricing - Insight Writer AI</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <PricingHeader 
          billingPeriod={billingPeriod} 
          setBillingPeriod={setBillingPeriod} 
        />
        
        <PricingPlans 
          billingPeriod={billingPeriod}
          isAuthenticated={isAuthenticated}
          onSelectPlan={handlePlanSelect}
        />
        
        <PricingFeatures />
        
        <PricingFAQ />
      </div>
    </Layout>
  );
};

export default Pricing;
