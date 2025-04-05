
import React from "react";
import PlanCard from "@/components/pricing/PlanCard";
import { PRICING_PLANS, PricingPeriod } from "@/constants/pricing";

interface PricingPlansProps {
  billingPeriod: PricingPeriod;
  isAuthenticated?: boolean;
  onSelectPlan: (planId: string) => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ 
  billingPeriod,
  isAuthenticated = false,
  onSelectPlan
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {PRICING_PLANS.map((plan) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          billingPeriod={billingPeriod}
          isAuthenticated={isAuthenticated}
          onSelectPlan={() => onSelectPlan(plan.id)}
        />
      ))}
    </div>
  );
};

export default PricingPlans;
