
import React from "react";
import { FileText, Zap, MessageSquare, Users } from "lucide-react";

const PricingFeatures: React.FC = () => {
  return (
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
    </div>
  );
};

export default PricingFeatures;
