
export type PlanType = "starter" | "professional" | "agency";
export type PricingPeriod = "monthly" | "yearly";

export interface PlanFeatures {
  blogs: number;
  keywords: number;
  support: string;
  [key: string]: string | number | boolean; // Allow for additional feature properties
}

export interface PricingPlan {
  id: PlanType;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeatures;
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals just getting started",
    priceMonthly: 29,
    priceYearly: 290,
    features: {
      blogs: 5,
      keywords: 10,
      support: "Email support",
      basic_content: true,
      title_options: 3
    }
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for content creators and small businesses",
    priceMonthly: 59,
    priceYearly: 590,
    features: {
      blogs: 15,
      keywords: 30,
      support: "Priority email support",
      custom_content: true,
      title_options: 5,
      google_drive: true,
      analytics: true
    },
    popular: true
  },
  {
    id: "agency",
    name: "Agency",
    description: "For teams and agencies with multiple clients",
    priceMonthly: 119,
    priceYearly: 1190,
    features: {
      blogs: 50,
      keywords: 100,
      support: "Dedicated account manager",
      custom_branding: true,
      title_options: 999, // Unlimited
      team_collab: true,
      api_access: true,
      white_label: true
    }
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
