
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { 
  PlanType, 
  PricingPeriod, 
  PricingPlan,
  getMonthlyPriceForYearly,
  getYearlySavings,
  getPlanPrice
} from "@/constants/pricing";

interface PlanCardProps {
  plan: PricingPlan;
  billingPeriod: PricingPeriod;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, billingPeriod }) => {
  const isAnnual = billingPeriod === "yearly";
  const price = getPlanPrice(plan.id, billingPeriod);
  const monthlyPrice = isAnnual ? getMonthlyPriceForYearly(plan.id) : price;
  const savings = isAnnual ? getYearlySavings(plan.id) : 0;
  
  return (
    <div 
      className={`glass p-6 rounded-xl relative ${plan.popular ? "border-2 border-primary" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
      <p className="text-foreground/70 mb-6">{plan.description}</p>
      
      <div className="mb-6">
        {isAnnual ? (
          <>
            <p className="text-4xl font-bold">
              ${monthlyPrice}
              <span className="text-sm text-foreground/70">/month</span>
            </p>
            <p className="text-sm text-foreground/70">
              Billed annually (${price}/year)
              {savings > 0 && (
                <span className="text-green-600 ml-2">Save ${savings}</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-4xl font-bold">
            ${price}
            <span className="text-sm text-foreground/70">/month</span>
          </p>
        )}
      </div>
      
      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>Up to {plan.features.wordCount.toLocaleString()} words per month</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>AI Blog Post Generation</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>Robust Search Data Integration</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>SEO Optimization Tools</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>Blog Post Outline Generator</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
          <span>Headline Analyzer</span>
        </li>
        {plan.features.prioritySupport && (
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
            <span>Priority Support</span>
          </li>
        )}
        {plan.features.teamMembers && (
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 mr-2 text-primary mt-1 flex-shrink-0" />
            <span>Up to {plan.features.teamMembers} team members</span>
          </li>
        )}
      </ul>
      
      <Link
        to="/checkout"
        state={{ plan: plan.id as PlanType, period: billingPeriod }}
      >
        <Button fullWidth variant={plan.popular ? "primary" : "outline"}>
          Choose {plan.name}
        </Button>
      </Link>
    </div>
  );
};

export default PlanCard;
