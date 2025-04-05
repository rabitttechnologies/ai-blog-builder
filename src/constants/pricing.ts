
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
  features: string[]; // Changed to string[] to match actual usage in PlanCard
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for individual bloggers and content creators",
    priceMonthly: 19,
    priceYearly: 199,
    features: [
      "10,000 words per month",
      "AI-powered content generation",
      "Search data analysis",
      "Basic SEO tools",
      "Outline generator",
      "Headline analyzer"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for professional content marketers and small businesses",
    priceMonthly: 49,
    priceYearly: 499,
    features: [
      "35,000 words per month",
      "Advanced AI content generation",
      "Comprehensive search data",
      "Full SEO toolkit",
      "Advanced outline generator",
      "Headline analyzer with A/B testing",
      "Priority support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and agencies with multiple clients",
    priceMonthly: 99,
    priceYearly: 999,
    features: [
      "75,000 words per month",
      "Enterprise-grade AI generation",
      "Premium search data access",
      "Complete SEO suite",
      "Team collaboration tools",
      "Custom templates",
      "Dedicated account manager",
      "5 team members included"
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
