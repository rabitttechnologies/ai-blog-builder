
import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { TRIAL_LENGTH_DAYS } from "@/constants/pricing";
import KeywordInput from "@/components/blog/KeywordInput";
import SignupForm from "@/components/auth/SignupForm";

interface TryItNowSectionProps {
  onKeywordSubmit: (keywords: string[], niche: string) => void;
}

const TryItNowSection: React.FC<TryItNowSectionProps> = ({ onKeywordSubmit }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container-tight">
        <div className="text-center mb-10">
          <div className="badge badge-primary mb-3">Get Started</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try It For Free</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Start your {TRIAL_LENGTH_DAYS}-day free trial with 2 blog credits. No credit card required.
          </p>
        </div>

        <div className="glass p-6 rounded-xl text-center mb-10 border border-blue-100 bg-blue-50/50">
          <h3 className="text-xl font-semibold mb-2">Free {TRIAL_LENGTH_DAYS}-Day Trial</h3>
          <p className="mb-4">Get full access to Insight Writer AI for {TRIAL_LENGTH_DAYS} days with 2 free blog posts</p>
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>No credit card</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Full access</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Cancel anytime</span>
            </div>
          </div>
          <Link to="/signup">
            <Button size="lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KeywordInput onSubmit={onKeywordSubmit} />
          <SignupForm />
        </div>
      </div>
    </section>
  );
};

export default TryItNowSection;
