
export type PlanType = "basic" | "pro" | "enterprise";
export type PricingPeriod = "monthly" | "yearly";

export interface PlanFeatures {
  wordCount: number;
  aiGeneration: boolean;
  searchData: boolean;
  seoTools: boolean;
  outlineGenerator: boolean;
  headlineAnalyzer: boolean;
  prioritySupport: boolean;
  teamMembers?: number;
  [key: string]: string | number | boolean | undefined; // Allow for additional feature properties
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
    id: "basic",
    name: "Basic",
    description: "Perfect for individual bloggers and content creators",
    priceMonthly: 19,
    priceYearly: 199,
    features: {
      wordCount: 10000,
      aiGeneration: true,
      searchData: true,
      seoTools: true,
      outlineGenerator: true,
      headlineAnalyzer: true,
      prioritySupport: false
    }
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for professional content marketers and small businesses",
    priceMonthly: 49,
    priceYearly: 499,
    features: {
      wordCount: 35000,
      aiGeneration: true,
      searchData: true,
      seoTools: true,
      outlineGenerator: true,
      headlineAnalyzer: true,
      prioritySupport: true
    },
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and agencies with multiple clients",
    priceMonthly: 99,
    priceYearly: 999,
    features: {
      wordCount: 75000,
      aiGeneration: true,
      searchData: true,
      seoTools: true,
      outlineGenerator: true,
      headlineAnalyzer: true,
      prioritySupport: true,
      teamMembers: 5
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

// Calculate yearly savings
export const getYearlySavings = (planId: PlanType): number => {
  const plan = PRICING_PLANS.find(plan => plan.id === planId);
  if (!plan) return 0;
  
  return (plan.priceMonthly * 12) - plan.priceYearly;
};

export const getPlanById = (planId: PlanType): PricingPlan | undefined => {
  return PRICING_PLANS.find(plan => plan.id === planId);
};

// Trial information
export const TRIAL_LENGTH_DAYS = 14;
