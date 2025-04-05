
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/auth";
import { PricingPeriod } from "@/constants/pricing";

// Import refactored components
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import PricingFeatures from "@/components/pricing/PricingFeatures";
import PricingFAQ from "@/components/pricing/PricingFAQ";

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<PricingPeriod>("yearly");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Pricing - Insight Writer AI</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <PricingHeader 
          billingPeriod={billingPeriod} 
          setBillingPeriod={setBillingPeriod} 
        />
        
        <PricingPlans billingPeriod={billingPeriod} />
        
        <PricingFeatures />
        
        <PricingFAQ />
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
