
import React from "react";
import PlanCard from "@/components/pricing/PlanCard";
import { PRICING_PLANS, PricingPeriod } from "@/constants/pricing";

interface PricingPlansProps {
  billingPeriod: PricingPeriod;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ billingPeriod }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PRICING_PLANS.map((plan) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          billingPeriod={billingPeriod} 
        />
      ))}
    </div>
  );
};

export default PricingPlans;
