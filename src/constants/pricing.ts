
export type PlanType = "starter" | "professional" | "agency";
export type PricingPeriod = "monthly" | "yearly";

export interface PricingPlan {
  id: PlanType;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals just getting started",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "5 AI-generated blogs per month",
      "SEO keyword research",
      "3 title options per blog",
      "Basic content structure",
      "Email support"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for content creators and small businesses",
    priceMonthly: 59,
    priceYearly: 590,
    features: [
      "15 AI-generated blogs per month",
      "Advanced SEO keyword research",
      "5 title options per blog",
      "Custom content structure",
      "Priority email support",
      "Google Drive integration",
      "Analytics and performance tracking"
    ],
    popular: true
  },
  {
    id: "agency",
    name: "Agency",
    description: "For teams and agencies with multiple clients",
    priceMonthly: 119,
    priceYearly: 1190,
    features: [
      "50 AI-generated blogs per month",
      "Enterprise-grade SEO research",
      "Unlimited title options",
      "Custom branding and templates",
      "Dedicated account manager",
      "Team collaboration features",
      "API access",
      "White-label exports"
    ]
  }
];

export const getPlanPrice = (planId: PlanType, period: PricingPeriod): number => {
  const plan = PRICING_PLANS.find(plan => plan.id === planId);
  if (!plan) return 0;
  
  return period === "monthly" ? plan.priceMonthly : plan.priceYearly;
};

// Calculate per month price for yearly subscription
export const getMonthlyPriceForYearly = (planId: PlanType): number => {
  const plan = PRICING_PLANS.find(plan => plan.id === planId);
  if (!plan) return 0;
  
  return Math.round(plan.priceYearly / 12);
};

export const getPlanById = (planId: PlanType): PricingPlan | undefined => {
  return PRICING_PLANS.find(plan => plan.id === planId);
};

// Trial information
export const TRIAL_LENGTH_DAYS = 14;
export const TRIAL_SUBSCRIPTION_LENGTH_DAYS = 7;
