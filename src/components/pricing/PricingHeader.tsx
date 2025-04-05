
import React from "react";
import { PricingPeriod } from "@/constants/pricing";

interface PricingHeaderProps {
  billingPeriod: PricingPeriod;
  setBillingPeriod: (period: PricingPeriod) => void;
}

const PricingHeader: React.FC<PricingHeaderProps> = ({ 
  billingPeriod, 
  setBillingPeriod 
}) => {
  return (
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
  );
};

export default PricingHeader;
