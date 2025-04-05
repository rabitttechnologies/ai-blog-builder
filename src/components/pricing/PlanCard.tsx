
import React from "react";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { PlanType, PricingPeriod, getPlanPrice, getMonthlyPriceForYearly } from "@/constants/pricing";

interface PlanCardProps {
  plan: any; // Using 'any' to match the existing type in the original file
  billingPeriod: PricingPeriod;
  isAuthenticated?: boolean;
  onSelectPlan: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  billingPeriod,
  isAuthenticated = false,
  onSelectPlan
}) => {
  const price = getPlanPrice(plan.id as PlanType, billingPeriod);
  const monthlyPrice = billingPeriod === "yearly" ? getMonthlyPriceForYearly(plan.id as PlanType) : price;
  
  const buttonText = isAuthenticated ? "Select Plan" : "Start Free Trial";
  
  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden ${plan.popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      {plan.popular && (
        <div className="bg-primary py-1.5 px-4 text-center">
          <span className="text-xs font-medium text-white uppercase tracking-wide">Most Popular</span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-foreground/70 mt-1">{plan.description}</p>
        
        <div className="mt-4">
          {billingPeriod === "yearly" ? (
            <>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${monthlyPrice}</span>
                <span className="text-foreground/70 ml-1">/month</span>
              </div>
              <div className="text-sm text-foreground/70">
                billed annually (${price}/year)
              </div>
              <div className="text-xs text-green-600 font-medium mt-1">
                Save ${(plan.priceMonthly * 12) - plan.priceYearly} annually
              </div>
            </>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">${price}</span>
              <span className="text-foreground/70 ml-1">/month</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-6"
          variant={plan.popular ? "primary" : "outline"}
          onClick={onSelectPlan}
        >
          {buttonText}
        </Button>
        
        <ul className="mt-6 space-y-3">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
