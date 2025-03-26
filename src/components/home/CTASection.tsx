
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { TRIAL_LENGTH_DAYS } from "@/constants/pricing";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container-tight text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content Strategy?</h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Start creating high-quality, SEO-optimized blog content today with our {TRIAL_LENGTH_DAYS}-day free trial.
        </p>
        <Link to="/signup">
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Start Your Free Trial
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
