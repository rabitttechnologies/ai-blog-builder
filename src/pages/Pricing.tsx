
import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/auth";
import { CheckCircle, FileText, Users, Rocket } from "lucide-react";
import { 
  PlanType, 
  PricingPeriod, 
  PRICING_PLANS, 
  getPlanPrice,
  getMonthlyPriceForYearly
} from "@/constants/pricing";

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Pricing - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>
        <p className="text-foreground/70 mb-8">
          Start creating SEO-optimized blog posts with our AI-powered platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className="glass p-6 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-foreground/70 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <p className="text-4xl font-bold">
                  ${getMonthlyPriceForYearly(plan.id)}
                  <span className="text-sm text-foreground/70">/month</span>
                </p>
                <p className="text-sm text-foreground/70">Billed annually</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  {plan.features.blogs} Blogs per month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  {plan.features.keywords} Keywords tracked
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  {plan.features.support}
                </li>
              </ul>
              
              <Link
                to="/checkout"
                state={{ plan: plan.id as PlanType, period: "yearly" as PricingPeriod }}
              >
                <Button fullWidth>
                  Choose {plan.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 rounded-xl glass">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">What is BlogCraft?</h3>
              <p className="text-foreground/70">
                BlogCraft is an AI-powered platform that helps you create SEO-optimized blog posts quickly and easily.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">How does the free trial work?</h3>
              <p className="text-foreground/70">
                The free trial gives you access to 2 free blogs for 14 days. No credit card required.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">What payment methods do you accept?</h3>
              <p className="text-foreground/70">
                We accept all major credit cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
