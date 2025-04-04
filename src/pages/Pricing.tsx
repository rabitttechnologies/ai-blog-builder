
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/auth";
import { CheckCircle, FileText, MessageSquare, Zap, Users } from "lucide-react";
import { 
  PlanType, 
  PricingPeriod, 
  PRICING_PLANS, 
  getPlanPrice,
  getMonthlyPriceForYearly,
  getYearlySavings
} from "@/constants/pricing";

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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Start creating SEO-optimized blog posts with our AI-powered platform.
            All plans include our core features to help you rank #1 in search results.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="bg-secondary/30 p-1 rounded-full flex items-center">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${billingPeriod === "monthly" ? "bg-primary text-white" : ""}`}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly billing
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${billingPeriod === "yearly" ? "bg-primary text-white" : ""}`}
                onClick={() => setBillingPeriod("yearly")}
              >
                Annual billing 
                <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Save up to $189</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isAnnual = billingPeriod === "yearly";
            const price = getPlanPrice(plan.id, billingPeriod);
            const monthlyPrice = isAnnual ? getMonthlyPriceForYearly(plan.id) : price;
            const savings = isAnnual ? getYearlySavings(plan.id) : 0;
            
            return (
              <div 
                key={plan.id} 
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
          })}
        </div>
        
        <div className="mt-12 p-8 rounded-xl glass">
          <h2 className="text-xl font-semibold mb-6">All plans include:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">SEO-Optimized Content</h3>
                <p className="text-sm text-foreground/70">Content crafted for search engines and readers</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Fast Generation</h3>
                <p className="text-sm text-foreground/70">Create blog posts in minutes, not hours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Keyword Research</h3>
                <p className="text-sm text-foreground/70">Find the best keywords for your content</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Easy Collaboration</h3>
                <p className="text-sm text-foreground/70">Work together with your team</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What is Insight Writer AI?</h3>
                <p className="text-foreground/70">
                  Insight Writer AI is an AI-powered platform that helps you create SEO-optimized blog posts quickly and easily.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Is there a free trial?</h3>
                <p className="text-foreground/70">
                  Yes, we offer a 14-day free trial with 2 blog posts so you can experience the power of our platform before committing.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Can I upgrade or downgrade my plan later?</h3>
                <p className="text-foreground/70">
                  Yes, you can change your plan at any time. If you upgrade, we'll prorate the difference. If you downgrade, the new rate will apply at your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">What payment methods do you accept?</h3>
                <p className="text-foreground/70">
                  We accept all major credit cards through our secure payment processor, Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
