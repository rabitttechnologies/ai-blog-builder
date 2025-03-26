
import React from "react";
import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-3">The Platform</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Insight Writer AI</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our AI-powered platform combines the efficiency of automation with the quality of human oversight.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl card-hover">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Keyword Research</h3>
            <p className="text-foreground/70">
              Our AI analyzes search trends to find the most relevant keywords for your niche using Tavily SERP data.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
              alt="Keyword research visualization" 
              className="w-full h-auto rounded-lg mt-4 object-cover"
            />
          </div>
          
          <div className="glass p-6 rounded-xl card-hover">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Content Creation</h3>
            <p className="text-foreground/70">
              Generate SEO-optimized blog content using advanced language models tailored to your specific industry.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
              alt="AI content creation" 
              className="w-full h-auto rounded-lg mt-4 object-cover"
            />
          </div>
          
          <div className="glass p-6 rounded-xl card-hover">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Human Approval</h3>
            <p className="text-foreground/70">
              Review and approve AI-generated content at every stage, ensuring quality and brand consistency.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Human review process" 
              className="w-full h-auto rounded-lg mt-4 object-cover"
            />
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/signup">
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Explore All Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
